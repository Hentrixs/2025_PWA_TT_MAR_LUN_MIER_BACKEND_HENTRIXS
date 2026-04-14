import workspaceMemberRepository from "../repository/member.repository.js";
import userRepository from "../repository/user.repository.js";
import ServerError from "../helpers/error.helper.js";
import jwt from 'jsonwebtoken';
import ENVIRONMENT from "../config/environment.config.js";

class MemberWorkspaceService {
    async getWorkspaces(user_id) {
        const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user_id);
        return workspaces;
    };

    async create(user_id, workspace_id, role) {
        const existing = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user_id);
        if (existing) {
            throw new ServerError('El usuario ya es miembro de este workspace', 400);
        };
        await workspaceMemberRepository.create(workspace_id, user_id, role);
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
            throw new ServerError('El usuario invitado no existe', 404);
        }

        const existingMember = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, invitedUser._id);
        if (existingMember) {
            if (existingMember.acceptInvitation === 'pending') throw new ServerError('Ya hay una invitación pendiente para este usuario', 400);
            throw new ServerError('El usuario ya es miembro de este espacio de trabajo', 400);
        }

        // Creamos al miembro en estado 'pending' (por default)
        const newMember = await workspaceMemberRepository.create(workspace_id, invitedUser._id, role);

        // 1. Fabricamos dos tokens. Al token no le pasamos todo el Member, solo los datos clave y la accion.
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

        // 2. Armamos los links mágicos. 
        const accept_link = `${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace_id}/member/?token=${accept_token}`;
        const reject_link = `${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace_id}/member/?token=${reject_token}`;

        // 3. (OPCIONAL POR AHORA) Mandamos el correo. Como todavía no configuramos Nodemailer, lo comentamos e imprimimos por consola.
        console.log("=== EMAIL DE INVITACIÓN SIMULADO ===");
        console.log(`Para: ${invited_email}`);
        console.log(`Link para ACEPTAR: ${accept_link}`);
        console.log(`Link para RECHAZAR: ${reject_link}`);
        console.log("=====================================");

        return newMember;
    };

    async respondToInvitation(token) {
        if (!token) throw new ServerError('Token no proporcionado', 400);

        try {
            // 1. Desencriptamos el token y sacamos las 3 variables que le metimos antes
            const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);
            const { email, workspace_id, action } = payload;

            // 2. Buscamos al usuario real 
            const user = await userRepository.getByEmail(email);
            if (!user) throw new ServerError('Usuario no encontrado', 404);

            // 3. Buscamos la membresia
            const membership = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user._id);
            if (!membership) throw new ServerError('Invitación no encontrada', 404);

            if (membership.acceptInvitation !== 'pending') throw new ServerError('Ya has respondido a esta invitación', 400);

            // 4. Actualizamos y le mandamos el 'action' (que va a decir 'accepted' o 'rejected' dependiendo qué botón tocó)
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
