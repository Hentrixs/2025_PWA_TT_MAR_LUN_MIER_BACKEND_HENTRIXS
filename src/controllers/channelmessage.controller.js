import ChannelMessagesRepository from "../repository/channelMessages.repository.js";
import ServerError from "../helpers/error.helper.js";

class channelMessagesController {
    async createChannelMessage(req,res) {
        try {
            const { fk_id_channel, fk_id_member, content } = req.body;
            await ChannelMessagesRepository.createChannelMessage(fk_id_channel,fk_id_member,content,new Date());

            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Mensaje Creado',
            });
        } catch(err) {
            if (err instanceof ServerError) {
                return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            }
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        }
    }

    async getChannelMessagesHistory(req,res) {
        try {
            const { fk_id_channel } = req.query;
            const channelMessagesHistory = await ChannelMessagesRepository.getChannelMessagesHistory(fk_id_channel);
            return res.status(200).json({
                ok: true,
                status: 200,
                messages: 'Historial de Mensajes Obtenido',
                data: { channelMessagesHistory }
            });
        } catch(err) {
            if (err instanceof ServerError) {
                return res.status(err.status).json({ ok: false, message: err.message, status: err.status });
            }
            res.status(500).json({ ok: false, message: 'Error interno del servidor.', status: 500 });
        };
    };
};

const ChannelMessagesController = new channelMessagesController();
export default ChannelMessagesController;