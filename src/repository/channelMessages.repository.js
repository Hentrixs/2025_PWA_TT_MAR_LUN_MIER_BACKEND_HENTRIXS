import ChannelMessages from "../models/channelMessages.model.js";

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
            .populate({ path: 'fk_id_member', populate: { path: 'fk_id_user' } });

        const channelMessagesHistoryNormalized = channelMessagesHistory.map((msg) => {
            return {
                id: msg._id,
                fk_id_channel: msg.fk_id_channel,
                content: msg.content,
                fk_id_member: msg.fk_id_member?._id,
                sender_name: msg.fk_id_member?.fk_id_user?.name || 'Usuario Eliminado',
                role: msg.fk_id_member?.role || 'user',

                created_at: msg.created_at,
                __v: msg.__v
            }
        });

        console.log(channelMessagesHistoryNormalized);

        return channelMessagesHistoryNormalized;
    };
};

const ChannelMessagesRepository = new channelMessagesRepository();
export default ChannelMessagesRepository;
