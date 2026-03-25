import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import workspaceMemberRepository from "../repository/member.repository.js";

class workspaceController {
    async getWorkspaces(req, res) {
        try {
            const { user } = req;
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id);

            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Exito',
                data: { workspaces }
            });
        } catch (err) {
            if (err instanceof ServerError) {
                res.status(err.status).json({
                    ok: false,
                    status: err.status,
                    message: err.message
                });
            } else {
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Internal Server Error.'
                });
            }
        };
    };
};

const WorkspaceController = new workspaceController();
export default WorkspaceController;