import ChannelRepository from '../repository/channel.repository.js';
import ServerError from '../helpers/error.helper.js';
import ChannelDTO from '../dto/channel.dto.js';
import ChannelMessagesRepository from '../repository/channelMessages.repository.js';
import MessageDTO from '../dto/message.dto.js';

class channelController {

    async createChannel(req, res) {
        try {
            const { name, description } = req.body;
            const { workspace_id: fk_id_workspace } = req.params;

            if (!name || !description) {
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
            const channels_raw = await ChannelRepository.getAll();
            const channels = channels_raw.map(channel => new ChannelDTO(channel));
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
            const channel_list_raw = await ChannelRepository.getChannelByWorkspaceId(fk_id_workspace);

            const channel_list = channel_list_raw.map(channel => new ChannelDTO(channel));

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

    async createChannelMessage(req, res) {
        try {
            const { channel_id } = req.params;
            const { fk_id_member, content } = req.body;
            await ChannelMessagesRepository.createChannelMessage(channel_id, fk_id_member, content, new Date());

            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Mensaje Creado',
            });
        } catch (err) {
            if (err instanceof ServerError) {
                return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            }
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    }

    async getChannelMessagesHistory(req, res) {
        try {
            const { channel_id } = req.params;
            const channelMessagesHistory_raw = await ChannelMessagesRepository.getChannelMessagesHistory(channel_id);
            const channelMessagesHistory = channelMessagesHistory_raw.map(msg => new MessageDTO(msg));

            return res.status(200).json({
                ok: true,
                status: 200,
                messages: 'Historial de Mensajes Obtenido',
                data: { channelMessagesHistory }
            });
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
