import memberWorkspaceService from '../services/memberWorkspace.service.js';
import ServerError from '../helpers/error.helper.js';
import ENVIRONMENT from '../config/environment.config.js';
import { getRequestLanguage } from '../helpers/lang.helper.js';
import { translate } from '../helpers/translation.helper.js';

class workspaceMemberController {

    async getMemberList(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const lang = getRequestLanguage(req);
            const members = await memberWorkspaceService.getMemberList(workspace_id);
            res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Lista de miembros obtenida correctamente', lang),
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
            const lang = getRequestLanguage(req);

            if (requesting_member._id.toString() === member_id) {
                throw new ServerError('No puedes eliminarte a ti mismo del workspace.', 400);
            }

            await memberWorkspaceService.deleteMember(member_id);
            res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Miembro eliminado correctamente', lang)
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
            const lang = getRequestLanguage(req);

            if (requesting_member._id.toString() === member_id && role === 'member') {
                throw new ServerError('No puedes degradar tu propio rol a member.', 400);
            }

            const updatedMember = await memberWorkspaceService.updateRole(member_id, role);
            res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Rol de miembro actualizado', lang),
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
            const lang = getRequestLanguage(req);
            await memberWorkspaceService.inviteMember(workspace_id, email, role, lang);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Invitacion Enviada', lang)
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
