import ChannelRepository from '../repository/channel.repository.js';
import ServerError from '../helpers/error.helper.js';
import ChannelDTO from '../dto/channel.dto.js';
import ChannelMessagesRepository from '../repository/channelMessages.repository.js';
import MessageDTO from '../dto/message.dto.js';
import { getRequestLanguage } from '../helpers/lang.helper.js';
import { translate } from '../helpers/translation.helper.js';

class channelController {

    async createChannel(req, res, next) {
        try {
            const { name, description } = req.body;
            const { workspace_id: fk_id_workspace } = req.params;
            const lang = getRequestLanguage(req);
            await ChannelRepository.create(fk_id_workspace, name, description);
            res.status(201).json({
                ok: true,
                status: 201,
                message: translate('Canal creado exitosamente.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async getAll(_req, res, next) {
        try {
            const lang = getRequestLanguage(_req);
            const channels_raw = await ChannelRepository.getAll();
            const channels = channels_raw.map(channel => new ChannelDTO(channel));
            res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Canales encontrados', lang),
                data: { channels }
            });
        } catch (err) {
            next(err);
        }
    }

    async getChannelByWorkspaceId(req, res, next) {
        try {
            const { workspace_id: fk_id_workspace } = req.params;
            const lang = getRequestLanguage(req);
            const channel_list_raw = await ChannelRepository.getChannelByWorkspaceId(fk_id_workspace);
            const channel_list = channel_list_raw.map(channel => new ChannelDTO(channel));
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Canales traidos exitosamente.', lang),
                data: { channel_list }
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteChannelById(req, res, next) {
        try {
            const { channel_id } = req.params;
            const lang = getRequestLanguage(req);
            await ChannelMessagesRepository.deleteMessagesByChannelId(channel_id);
            await ChannelRepository.deleteChannelById(channel_id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Canal eliminado correctamente.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async updateMessageById(req, res, next) {
        try {
            const { message_id } = req.params;
            const { content } = req.body;
            const { _id: member_id } = req.member;
            const lang = getRequestLanguage(req);

            if (!content) throw new ServerError('El contenido no puede estar vacío', 400);

            const message = await ChannelMessagesRepository.getMessageById(message_id);
            if (message.fk_id_member.toString() !== member_id.toString()) {
                throw new ServerError('No tienes permiso para editar este mensaje.', 403);
            }

            const updated_message = await ChannelMessagesRepository.updateMessageById(message_id, content);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Mensaje actualizado.', lang),
                data: { message: updated_message }
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteMessageById(req, res, next) {
        try {
            const { message_id } = req.params;
            const { _id: member_id } = req.member;
            const lang = getRequestLanguage(req);

            const message = await ChannelMessagesRepository.getMessageById(message_id);
            if (message.fk_id_member.toString() !== member_id.toString()) {
                throw new ServerError('No tienes permiso para eliminar este mensaje.', 403);
            }

            await ChannelMessagesRepository.deleteMessageById(message_id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Mensaje eliminado.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async createChannelMessage(req, res, next) {
        try {
            const { channel_id } = req.params;
            const { fk_id_member, content } = req.body;
            const lang = getRequestLanguage(req);

            if (!channel_id || !fk_id_member || !content) {
                throw new ServerError('Faltan Credenciales', 400);
            }

            await ChannelMessagesRepository.createChannelMessage(channel_id, fk_id_member, content, new Date());
            res.status(201).json({
                ok: true,
                status: 201,
                message: translate('Mensaje Creado', lang),
            });
        } catch (err) {
            next(err);
        }
    }

    async getChannelMessagesHistory(req, res, next) {
        try {
            const { channel_id } = req.params;
            const lang = getRequestLanguage(req);
            const channelMessagesHistory_raw = await ChannelMessagesRepository.getChannelMessagesHistory(channel_id);
            const channelMessagesHistory = channelMessagesHistory_raw.map(msg => new MessageDTO(msg));
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Historial de Mensajes Obtenido', lang),
                data: { channelMessagesHistory }
            });
        } catch (err) {
            next(err);
        }
    }

    async updateChannelById(req, res, next) {
        try {
            const { _id: channel_id } = req.channel;
            const { name, description } = req.body;
            const lang = getRequestLanguage(req);
            const updated_channel = await ChannelRepository.updateChannelById(channel_id, name, description);
            res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Canal actualizado correctamente.', lang),
                data: { channel: updated_channel }
            });
        } catch (err) {
            next(err);
        }
    }
}

const ChannelController = new channelController();
export default ChannelController;
