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
        const channel_list = await Channel.find({fk_id_workspace: fk_id_workspace});
        return channel_list;
    };
};

const ChannelRepository = new channelRepository();
export default ChannelRepository;