import DirectMessage from '../models/directMessage.model.js';
import ServerError from '../helpers/error.helper.js';

class DirectMessageRepository {

    async getConversation(workspace_id, member_a_id, member_b_id) {
        const messages = await DirectMessage.find({
            fk_id_workspace: workspace_id,
            $or: [
                { fk_id_sender_member: member_a_id, fk_id_receiver_member: member_b_id },
                { fk_id_sender_member: member_b_id, fk_id_receiver_member: member_a_id }
            ]
        })
        .populate({
            path: 'fk_id_sender_member',
            populate: { path: 'fk_id_user', model: 'User', select: 'name' }
        })
        .sort({ created_at: 1 })
        .lean();

        return messages.map(msg => ({
            message_id: msg._id,
            content: msg.content,
            edited: msg.edited,
            member_id: msg.fk_id_sender_member?._id,
            sender_name: msg.fk_id_sender_member?.fk_id_user?.name || 'Usuario Eliminado',
            created_at: msg.created_at
        }));
    }

    async createMessage(workspace_id, sender_id, receiver_id, content) {
        return await DirectMessage.create({
            fk_id_workspace: workspace_id,
            fk_id_sender_member: sender_id,
            fk_id_receiver_member: receiver_id,
            content,
            created_at: new Date()
        });
    }

    async getMessageById(message_id) {
        const msg = await DirectMessage.findById(message_id).lean();
        if (!msg) throw new ServerError('Mensaje no encontrado', 404);
        return msg;
    }

    async updateMessageById(message_id, content) {
        const updated = await DirectMessage.findByIdAndUpdate(
            message_id,
            { content, edited: true },
            { returnDocument: 'after' }
        );
        if (!updated) throw new ServerError('Mensaje no encontrado', 404);
        return updated;
    }
}

export default new DirectMessageRepository();
