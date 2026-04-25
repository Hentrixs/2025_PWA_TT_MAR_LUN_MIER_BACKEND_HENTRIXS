import workspaceMemberRepository from "../repository/member.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import workspaceService from "../services/workspace.service.js";
import ChannelRepository from "../repository/channel.repository.js";
import ChannelMessagesRepository from "../repository/channelMessages.repository.js";

class workspaceController {
    async getWorkspaces(req, res, next) {
        try {
            const { user } = req;
            const workspaces = await workspaceService.getWorkspaces(user.id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Operación exitosa.',
                data: { workspaces }
            });
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const { title, description, url_image } = req.body;
            const { user } = req;
            const workspace = await workspaceService.create(title, description, url_image, user.id);
            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'Workspace creado correctamente',
                data: { workspace_id: workspace._id }
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteById(req, res, next) {
        try {
            const { workspace_id } = req.params;

            // CASCADA: 1. Obtener todos los canales del workspace y borrar sus mensajes
            const channels = await ChannelRepository.getChannelByWorkspaceId(workspace_id);
            for (const channel of channels) {
                await ChannelMessagesRepository.deleteMessagesByChannelId(channel._id);
            }

            // 2. Borrar todos los canales físicos
            await ChannelRepository.deleteChannelsByWorkspaceId(workspace_id);

            // 3. Borrar todas las membresías vinculadas al espacio
            await workspaceMemberRepository.deleteMembersByWorkspaceId(workspace_id);

            // 4. Finalmente, borrar el Workspace padre
            await workspaceRepository.deleteById(workspace_id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Workspace eliminado'
            });
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const workspace = await workspaceRepository.getById(id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Workspace obtenido correctamente',
                data: { workspace }
            });
        } catch (err) {
            next(err);
        }
    }

    async updateRoleById(req, res, next) {
        try {
            const { id, role } = req.body;
            await workspaceMemberRepository.updateRoleById(id, role);
            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'Rol actualizado correctamente.'
            });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const workspaces = await workspaceMemberRepository.getAll();
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Lista de espacios de trabajo obtenida.',
                data: { workspaces }
            });
        } catch (err) {
            next(err);
        }
    }

    async getMemberList(req, res, next) {
        try {
            const { fk_id_workspace } = req.body;
            const memberlist = await workspaceMemberRepository.getMemberList(fk_id_workspace);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Lista de miembros obtenida.',
                data: { memberlist }
            });
        } catch (err) {
            next(err);
        }
    }

    async getWorkspaceDetail(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const workspace = await workspaceRepository.getById(workspace_id);
            const members = await workspaceMemberRepository.getMemberList(workspace_id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Datos del espacio de trabajo obtenidos',
                data: { workspace, members }
            });
        } catch (err) {
            next(err);
        }
    }

    async updateById(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const { title, description, url_image } = req.body;
            const updated_workspace = await workspaceRepository.updateById(workspace_id, title, description, url_image);
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Workspace actualizado correctamente.',
                data: { workspace: updated_workspace }
            });
        } catch (err) {
            next(err);
        }
    }
}

const WorkspaceController = new workspaceController();
export default WorkspaceController;
