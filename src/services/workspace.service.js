import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";
import ServerError from "../helpers/error.helper.js";

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title || !description || !user_id) throw new ServerError('Faltan campos requeridos', 400);
        const workspace = await workspaceRepository.create(title, description, url_image);
        await memberWorkspaceService.create(user_id, workspace._id, 'owner');
        return workspace;
    };

    async getWorkspaces(user_id) {
        const workspaces = await memberWorkspaceService.getWorkspaces(user_id);
        return workspaces;
    };
};

const workspaceService = new WorkspaceService();
export default workspaceService;
