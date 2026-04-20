import memberWorkspaceService from '../services/memberWorkspace.service.js';
import ServerError from '../helpers/error.helper.js';

class workspaceMemberController {

    async getMemberList(req, res) {
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
            if (err instanceof ServerError) return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    }

    async deleteMember(req, res) {
        try {
            const { member_id } = req.params;
            const requesting_member = req.member; // Inyectado por el middleware

            // Seguridad: Un miembro no puede borrarse a sí mismo desde este endpoint (Prioridad 9)
            if (requesting_member._id.toString() === member_id) {
                throw new ServerError('No puedes eliminarte a ti mismo del workspace. Si deseas salir, usa la opción de abandonar workspace (si existiera) o contacta a otro admin.', 400);
            }

            await memberWorkspaceService.deleteMember(member_id);

            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Miembro eliminado correctamente'
            });
        } catch (err) {
            if (err instanceof ServerError) return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    }

    async updateRole(req, res) {
        try {
            const { member_id } = req.params;
            const { role } = req.body;
            const requesting_member = req.member; // Inyectado por el middleware

            if (!role) throw new ServerError('Debe enviar el rol a modificar', 400);

            // Seguridad: Un admin no puede bajarse el rango a sí mismo (Prioridad 9)
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
            if (err instanceof ServerError) return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    }

    async inviteMember(req, res) {
        try {
            const { workspace_id } = req.params;
            const { email, role } = req.body;
            await memberWorkspaceService.inviteMember(workspace_id, email, role);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Invitacion Enviada'
            })
        } catch (err) {
            if (err instanceof ServerError) return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    }

    async respondToInvitation(req, res) {
        try {
            const { token } = req.query;
            const result = await memberWorkspaceService.respondToInvitation(token);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Se ha procesado la solicitud de invitacion con exito'
            })
        } catch (err) {
            if (err instanceof ServerError) return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    }
}

export default new workspaceMemberController();