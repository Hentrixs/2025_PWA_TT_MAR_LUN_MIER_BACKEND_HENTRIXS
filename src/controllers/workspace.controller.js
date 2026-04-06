import ServerError from "../helpers/error.helper.js";
import workspaceMemberRepository from "../repository/member.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";

class workspaceController {
    async getWorkspaces(req, res) {
        try {
            const { user } = req;
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id);
            console.log(workspaces);

            return res.status(200).json({
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
                console.log(err);
            }
        };
    };

    async create(req, res) {
        try {
            const { title, description } = req.body;
            const { user } = req;

            const workspace = await workspaceRepository.create(title, description);
            await workspaceMemberRepository.create(workspace._id, user.id, 'admin');

            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'Workspace creado correctamente',
                data: { workspace_id: workspace._id }
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
    }

    async deleteById(req, res) { // Parcialmente hecho
        try {
            const { id } = req.body; // Aca tampoco recuerdo de donde sacaba esto , por ahora lo dejo asi.
            await workspaceMemberRepository.deleteById(id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Workspace eliminado'
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
    }

    async getById(req, res) { // Parcialmente hecho
        try {
            const { id } = req.params; // lo mismo que los de arriba, no me acuerdo de donde se pasaba esto.
            const workspace = await workspaceMemberRepository.getById(id);
            return res.json(200).json({
                ok: true,
                status: 200,
                message: 'workspace creado correctamente',
                data: { workspace } // me pregunto porque esto ira entre {}
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
    }

    async updateRoleById(req, res) { // Parcialmente hecho
        try {
            const { id, role } = req.body;
            await workspaceMemberRepository.updateRoleById(id, role)
            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'role updated'
            })
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
    }

    async getAll(req, res) {
        try {
            const workspaces = await workspaceMemberRepository.getAll();
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'workspaces list getted',
                data: { workspaces }
            })
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
    }

    async getMemberList(req, res) {
        try {
            const { fk_id_workspace } = req.body;
            const memberlist = await workspaceMemberRepository.getMemberList(fk_id_workspace);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'memberlist gotted'
            })
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
    }
};

const WorkspaceController = new workspaceController();
export default WorkspaceController;