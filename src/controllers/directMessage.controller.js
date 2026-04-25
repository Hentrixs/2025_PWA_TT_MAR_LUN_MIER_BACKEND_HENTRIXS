import DirectMessageRepository from '../repository/directMessage.repository.js';
import ServerError from '../helpers/error.helper.js';

class DirectMessageController {

    async getConversation(req, res, next) {
        try {
            const { workspace_id, other_member_id } = req.params;
            const my_member_id = req.member._id;
            const messages = await DirectMessageRepository.getConversation(workspace_id, my_member_id, other_member_id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Conversación obtenida.',
                data: { messages }
            });
        } catch (err) {
            next(err);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const { workspace_id, other_member_id } = req.params;
            const { content } = req.body;
            const sender_id = req.member._id;
            await DirectMessageRepository.createMessage(workspace_id, sender_id, other_member_id, content);
            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'Mensaje enviado.'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateMessage(req, res, next) {
        try {
            const { message_id } = req.params;
            const { content } = req.body;
            const member_id = req.member._id;

            const message = await DirectMessageRepository.getMessageById(message_id);
            if (message.fk_id_sender_member.toString() !== member_id.toString()) {
                throw new ServerError('No tienes permiso para editar este mensaje.', 403);
            }

            const updated = await DirectMessageRepository.updateMessageById(message_id, content);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Mensaje actualizado.',
                data: { message: updated }
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new DirectMessageController();
