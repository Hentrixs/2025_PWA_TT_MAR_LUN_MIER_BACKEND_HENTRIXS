import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";
import ServerError from "../helpers/error.helper.js";
import AVAILABLE_MEMBER_ROLES from "../constants/roles.constant.js";
import workspaceDTO from "../dto/workspace.dto.js";

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title || !description || !user_id) throw new ServerError('Faltan campos requeridos', 400);
        const workspace = await workspaceRepository.create(title, description, url_image);
        await memberWorkspaceService.create(user_id, workspace._id, AVAILABLE_MEMBER_ROLES.OWNER);
        return workspace;
    };

    async getWorkspaces(user_id) {
        const workspaces_raw = await memberWorkspaceService.getWorkspaces(user_id);
        const workspaces = workspaces_raw.map(wk => new workspaceDTO(wk));
        return workspaces;
    };
};

const workspaceService = new WorkspaceService();
export default workspaceService;
