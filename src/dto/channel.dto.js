
class ChannelDTO {
    constructor(channel) {
        this.channel_id = channel._id;
        this.channel_name = channel.name;
        this.name = channel.name;
        this.channel_description = channel.description;
        this.channel_workspace_id = channel.fk_id_workspace;
        this.channel_is_active = channel.is_active;
    };
}; {/* TODO: Este es solo del DTO para el Channel, falta para las demas cosas */ }

export default ChannelDTO;