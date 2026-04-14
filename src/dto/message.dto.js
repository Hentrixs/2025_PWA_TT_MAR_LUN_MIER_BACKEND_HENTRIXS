class MessageDTO {
    constructor(message) {
        this.message_id = message._id;
        this.channel_id = message.fk_id_channel;
        this.member_id = message.fk_id_member;
        this.content = message.content;

        // Formateo de fecha: (ej: 20:15) como solicitaste en tus comentarios del modelo
        if (message.created_at) {
            const date = new Date(message.created_at);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            this.created_at = `${hours}:${minutes}`;
        } else {
            this.created_at = null;
        }
    }
}

export default MessageDTO;
