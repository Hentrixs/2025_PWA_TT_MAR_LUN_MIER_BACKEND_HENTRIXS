import ChannelMessages from "../models/channelMessages.model.js";
import ServerError from "../helpers/error.helper.js";

class channelMessagesRepository {

    async createChannelMessage(fk_id_channel, fk_id_member, content, created_at) {
        return await ChannelMessages.create({
            fk_id_channel: fk_id_channel,
            fk_id_member: fk_id_member,
            content: content,
            created_at: created_at
        });
    };

    async getChannelMessagesHistory(fk_id_channel) {
        const channelMessagesHistory = await ChannelMessages.find({ fk_id_channel: fk_id_channel })
            .populate({
                path: 'fk_id_member',
                populate: {
                    path: 'fk_id_user',
                    model: 'User',
                    select: 'name'
                }
            })
            .lean();

        const channelMessagesHistoryNormalized = channelMessagesHistory.map((msg) => {
            return {
                _id: msg._id,
                fk_id_channel: msg.fk_id_channel,
                content: msg.content,
                fk_id_member: msg.fk_id_member?._id,
                sender_name: msg.fk_id_member?.fk_id_user?.name || 'Usuario Eliminado',
                role: msg.fk_id_member?.role || 'user',

                created_at: msg.created_at,
                __v: msg.__v
            }
        });

        // 


        return channelMessagesHistoryNormalized;
    };

    async updateMessageById(message_id, content) {
        const updated_message = await ChannelMessages.findByIdAndUpdate(
            message_id,
            { content, edited: true },
            { returnDocument: 'after' }
        );
        if (!updated_message) throw new ServerError('Mensaje no encontrado', 404);
        return updated_message;
    };

    async deleteMessageById(message_id) {
        await ChannelMessages.findByIdAndDelete(message_id);
    };

    async getMessageById(message_id) {
        const message = await ChannelMessages.findById(message_id).lean();
        if (!message) throw new ServerError('Mensaje no encontrado', 404);
        return message;
    };

    async deleteMessagesByChannelId(channel_id) {
        await ChannelMessages.deleteMany({ fk_id_channel: channel_id });
    };
};

const ChannelMessagesRepository = new channelMessagesRepository();
export default ChannelMessagesRepository;
