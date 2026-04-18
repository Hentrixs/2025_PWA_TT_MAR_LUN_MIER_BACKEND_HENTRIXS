import Channel from "../models/channel.model.js";
import ServerError from "../helpers/error.helper.js";

class channelRepository {
    async create(fk_id_workspace, name, description) {
        if (!fk_id_workspace || !name || !description) {
            throw new ServerError("Faltan datos obligatorios para crear el canal (workspace, name o description)", 400);
        }
        return await Channel.create({
            fk_id_workspace: fk_id_workspace,
            name: name,
            description: description,
            created_at: new Date()
        });
    };

    async getAll() {
        const channel_list = await Channel.find();
        return channel_list;
    };

    async getChannelByWorkspaceId(fk_id_workspace) {
        const channel_list = await Channel.find({ fk_id_workspace: fk_id_workspace });
        return channel_list;
    };

    async deleteChannelById(channel_id) {
        return await Channel.findByIdAndDelete(channel_id);
    };

    async getById(channel_id) {
        return await Channel.findById(channel_id);
    };

    async deleteChannelsByWorkspaceId(workspace_id) {
        return await Channel.deleteMany({ fk_id_workspace: workspace_id });
    };

    async updateChannelById(channel_id, name, description) {
        const update = {};
        if (name !== undefined) update.name = name;
        if (description !== undefined) update.description = description;
        const updated_channel = await Channel.findByIdAndUpdate(
            channel_id,
            update,
            { new: true }
        );
        if (!updated_channel) throw new ServerError('Canal no encontrado', 404);
        return updated_channel;
    };
};

const ChannelRepository = new channelRepository();
export default ChannelRepository;