
import mongoose from "mongoose";

const channelMessagesSchema = new mongoose.Schema({
    fk_id_channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    fk_id_member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkspaceMember",
        required: true
    }, // vale, se necesitara hacer populate en el fk_id_member y una normalizacion
    content: { // ademas, seria bueno que el created at solo mostrase la hora en formato (ej: 20:15) y no toda la fecha
        type: String,   // aca el tema es que al hacer populate en el fk_id_member no me trae el nombre, me trae el fk_id_user y otras cosas que no son el nombre...
        required: true // entonces tengo que usar el fk_id_member con alguna otra funcion o como?
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const ChannelMessages = mongoose.model("ChannelMessage", channelMessagesSchema)

export default ChannelMessages