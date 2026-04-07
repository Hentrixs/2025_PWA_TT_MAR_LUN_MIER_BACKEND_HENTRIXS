import ServerError from "../helpers/error.helper.js";
import workspaceMemberRepository from "../repository/member.repository.js";
import workspaceRepository from "../repository/workspace.repository.js";
import workspaceService from "../services/workspace.service.js";

class workspaceController {
    async getWorkspaces(req, res) {
        try {
            const { user } = req;
            const workspaces = await workspaceService.getWorkspaces(user.id);

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

    async deleteById(req, res) {
        try {
            const { id } = req.body;
            await workspaceRepository.deleteById(id);
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

    async getById(req, res) {
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
                message: 'memberlist gotted',
                data: { memberlist }
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

    async getWorkspaceDetail(req,res) {
        try {
            const { workspace_id } = req.params;
            const workspace = await workspaceRepository.getById(workspace_id);
            const members = await workspaceMemberRepository.getMemberList(workspace_id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Datos del espacio de trabajo obtenidos',
                data: { workspace, members}
            })
        } catch(err) {
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
        }
    }
};

const WorkspaceController = new workspaceController();
export default WorkspaceController;