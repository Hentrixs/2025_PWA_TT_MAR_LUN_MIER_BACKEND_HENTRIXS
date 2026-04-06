import workspaceMemberRepository from "../repository/member.repository.js";
import ServerError from "../helpers/error.helper.js";

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
};

const memberWorkspaceService = new MemberWorkspaceService();
export default memberWorkspaceService;
