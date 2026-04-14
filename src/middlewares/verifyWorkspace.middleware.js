import { isValidObjectId } from 'mongoose';
import ServerError from "../helpers/error.helper.js";
import workspaceRepository from "../repository/workspace.repository.js";

async function verifyWorkspaceMiddleware(req, res, next) {
    const { workspace_id } = req.params;
    if (!workspace_id) {
        throw new ServerError('No se proporciono el espacio de trabajo.');
    };

    if (!isValidObjectId(workspace_id)) {
        throw new ServerError('id del espacio de trabajo invalida', 400);
    };

    try {
        const workspace = await workspaceRepository.getById(workspace_id);
        if (!workspace) {
            throw new ServerError('El espacio de trabajo no existe', 404);
        };

        req.workspace = workspace;
        next();
    } catch (err) {
        if (err instanceof ServerError) {
            return res.status(err.status).json({ ok: false, status: err.status, message: err.message })
        } else {
            console.error('Error inesperado', err)
            return res.status(500).json({ ok: false, status: 500, message: "Internal server error" })
        };
    };
};

export default verifyWorkspaceMiddleware;

