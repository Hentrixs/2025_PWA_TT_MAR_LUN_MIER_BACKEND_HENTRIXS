import ServerError from "../helpers/error.helper.js";
import { isValidObjectId } from "mongoose";
import ChannelRepository from "../repository/channel.repository.js";

async function verifyChannelMiddleware(req, res, next) {
    try {
        const { channel_id, workspace_id } = req.params;

        if (!channel_id) {
            throw new ServerError('No se proporciono espacio de trabajo');
        };

        if (!isValidObjectId(channel_id)) {
            throw new ServerError('id del canal invalida', 400)
        };

        const channel = await ChannelRepository.getById(channel_id);
        if (!channel) {
            throw new ServerError('El canal no existe', 404);
        };

        if (channel.fk_id_workspace.toString() !== workspace_id.toString()) {
            throw new ServerError('El canal no pertenece a este espacio de trabajo', 403);
        };

        req.channel = channel;
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

export default verifyChannelMiddleware;