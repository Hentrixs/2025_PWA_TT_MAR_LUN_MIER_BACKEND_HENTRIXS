import workspaceMemberRepository from "../repository/member.repository.js";
import userRepository from "../repository/user.repository.js";
import ServerError from "../helpers/error.helper.js";
import jwt from 'jsonwebtoken';
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/mailer.config.js";
import { getInvitationEmailTemplate } from "../helpers/emailTemplates.helper.js";

class MemberWorkspaceService {
    async getWorkspaces(user_id) {
        const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user_id);
        return workspaces;
    };

    async create(user_id, workspace_id, role, status = 'pending') {
        const existing = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user_id);
        if (existing) {
            throw new ServerError('El usuario ya es miembro de este workspace', 400);
        };
        await workspaceMemberRepository.create(workspace_id, user_id, role, status);
    };

    async getMemberList(workspace_id) {
        return await workspaceMemberRepository.getMemberList(workspace_id);
    };

    async deleteMember(member_id) {
        return await workspaceMemberRepository.deleteById(member_id);
    };

    async updateRole(member_id, role) {
        return await workspaceMemberRepository.updateRoleById(member_id, role);
    };

    async inviteMember(workspace_id, invited_email, role) {
        if (!workspace_id || !invited_email || !role) {
            throw new ServerError('Todos los campos son obligatorios', 400);
        }

        const invitedUser = await userRepository.getByEmail(invited_email);

        if (!invitedUser) {
            throw new ServerError('No se pudo encontrar un usuario registrado con ese correo electrónico.', 404);
        }

        const existingMember = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, invitedUser._id);
        if (existingMember) {
            if (existingMember.acceptInvitation === 'pending') throw new ServerError('Ya existe una invitación pendiente para esta cuenta.', 400);
            throw new ServerError('Esta cuenta ya forma parte del espacio de trabajo.', 400);
        }

        const newMember = await workspaceMemberRepository.create(workspace_id, invitedUser._id, role);

        const accept_token = jwt.sign(
            { email: invited_email, workspace_id, action: 'accepted' },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        const reject_token = jwt.sign(
            { email: invited_email, workspace_id, action: 'rejected' },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        const accept_link = `${ENVIRONMENT.URL_BACKEND}api/invitation/respond?token=${accept_token}`;
        const reject_link = `${ENVIRONMENT.URL_BACKEND}api/invitation/respond?token=${reject_token}`;

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: invited_email,
            subject: `${invitedUser.name}, has recibido una invitación a GreenSlack`,
            html: getInvitationEmailTemplate(invitedUser.name, accept_link, reject_link)
        });

        return newMember;
    };

    async respondToInvitation(token) {
        if (!token) throw new ServerError('Token no proporcionado', 400);

        try {
            const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);
            const { email, workspace_id, action } = payload;

            const user = await userRepository.getByEmail(email);
            if (!user) throw new ServerError('Cuenta no localizada.', 404);

            const membership = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user._id);
            if (!membership) throw new ServerError('Invitación no encontrada', 404);

            if (membership.acceptInvitation !== 'pending') throw new ServerError('Esta invitación ya ha sido procesada.', 400);

            const updatedMembership = await workspaceMemberRepository.updateInvitationStatus(membership._id, action);
            return updatedMembership;

        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Token inválido o expirado', 401);
            }
            throw error;
        }
    };
};

const memberWorkspaceService = new MemberWorkspaceService();
export default memberWorkspaceService;
