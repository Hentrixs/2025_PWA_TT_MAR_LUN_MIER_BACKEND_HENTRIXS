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
        const channelMessagesHistory = await ChannelMessages.find({fk_id_channel: fk_id_channel});
        return channelMessagesHistory;
    };
};

const ChannelMessagesRepository = new channelMessagesRepository;
export default ChannelMessagesRepository;
