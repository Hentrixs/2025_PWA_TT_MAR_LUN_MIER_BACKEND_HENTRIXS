import memberWorkspaceService from '../services/memberWorkspace.service.js';
import ServerError from '../helpers/error.helper.js';
import ENVIRONMENT from '../config/environment.config.js';

class workspaceMemberController {

    async getMemberList(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const members = await memberWorkspaceService.getMemberList(workspace_id);
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Lista de miembros obtenida correctamente',
                data: { members }
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteMember(req, res, next) {
        try {
            const { member_id } = req.params;
            const requesting_member = req.member;

            if (requesting_member._id.toString() === member_id) {
                throw new ServerError('No puedes eliminarte a ti mismo del workspace.', 400);
            }

            await memberWorkspaceService.deleteMember(member_id);
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Miembro eliminado correctamente'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateRole(req, res, next) {
        try {
            const { member_id } = req.params;
            const { role } = req.body;
            const requesting_member = req.member;

            if (requesting_member._id.toString() === member_id && role === 'member') {
                throw new ServerError('No puedes degradar tu propio rol a member.', 400);
            }

            const updatedMember = await memberWorkspaceService.updateRole(member_id, role);
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Rol de miembro actualizado',
                data: { member: updatedMember }
            });
        } catch (err) {
            next(err);
        }
    }

    async inviteMember(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const { email, role } = req.body;
            await memberWorkspaceService.inviteMember(workspace_id, email, role);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Invitacion Enviada'
            });
        } catch (err) {
            next(err);
        }
    }

    async respondToInvitation(req, res) {
        try {
            const { token } = req.query;
            const updatedMembership = await memberWorkspaceService.respondToInvitation(token);
            const status = updatedMembership.acceptInvitation;
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}invite/respond?status=${status}`);
        } catch (err) {
            const err_msg = encodeURIComponent(err.message || 'Error desconocido');
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}invite/respond?status=error&message=${err_msg}`);
        }
    }
}

export default new workspaceMemberController();
