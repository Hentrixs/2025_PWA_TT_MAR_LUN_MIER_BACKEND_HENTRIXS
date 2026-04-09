import ChannelRepository from '../repository/channel.repository.js';
import ServerError from '../helpers/error.helper.js';

class channelController {

    async createChannel(req, res) {
        try {
            const { name, description } = req.body;
            const { workspace_id: fk_id_workspace } = req.params;

            if (!fk_id_workspace || !name || !description) {
                throw new ServerError("Faltan campos obligatorios en el body", 400);
            }

            await ChannelRepository.create(fk_id_workspace, name, description);
            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Canal creado exitosamente.'
            });
        } catch (err) {
            console.error("Error al crear canal:", err.message);
            if (err instanceof ServerError) {
                return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            }
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    };

    async getAll(req, res) {
        try {
            const channels = await ChannelRepository.getAll();
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Canales encontrados',
                data: { channels }
            });
        } catch (err) {
            console.error("Error al crear canal:", err.message);
            if (err instanceof ServerError) {
                return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            }
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    };

    async getChannelByWorkspaceId(req, res) {
        try {
            const { workspace_id: fk_id_workspace } = req.params;
            const channel_list = await ChannelRepository.getChannelByWorkspaceId(fk_id_workspace);

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Canales traidos exitosamente.',
                data: { channel_list }
            })
        } catch (err) {
            if (err instanceof ServerError) {
                return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            }
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        };
    };

    async deleteChannelById(req, res) {
        try {
            const { channel_id } = req.params;
            await ChannelRepository.deleteChannelById(channel_id);
            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'Channel Borrado'
            })
        } catch (err) {
            if (err instanceof ServerError) {
                return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            }
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        };
    };

};


const ChannelController = new channelController();
export default ChannelController;
