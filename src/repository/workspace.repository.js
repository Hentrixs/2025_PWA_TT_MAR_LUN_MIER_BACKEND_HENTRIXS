
import ServerError from "../helpers/error.helper.js";
import WorkspaceModel from "../models/workspace.model.js";
import ChannelRepository from "./channel.repository.js";
class WorkspaceRepository {

    async create(title, description, url_image, active) {
        if (!title) {
            throw new ServerError('Faltan credenciales', 400);
        };
        const workspace = await WorkspaceModel.create({
            title: title,
            description: description,
            url_image,
            active
        });
        await ChannelRepository.create(workspace._id, 'General', 'Canal general del espacio de trabajo');

        return workspace;
    };

    async deleteById(workspace_id) {
        if (!workspace_id) {
            throw new ServerError('Faltan credenciales', 400);
        };
        await WorkspaceModel.findByIdAndDelete(workspace_id);
    };

    async getById(workspace_id) {
        if (!workspace_id) {
            throw new ServerError('Faltan credenciales', 400);
        };
        return await WorkspaceModel.findById(workspace_id)
    };

    async updateById(workspace_id, title, description, url_image) {
        if (!workspace_id) {
            throw new ServerError('Faltan credenciales', 400);
        };

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (url_image !== undefined) updates.url_image = url_image;

        const updated_workspace = await WorkspaceModel.findByIdAndUpdate(
            workspace_id,
            updates,
            { returnDocument: 'after' }
        );
        if (!updated_workspace) throw new ServerError('Workspace no encontrado', 404);
        return updated_workspace;
    };

}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository;

