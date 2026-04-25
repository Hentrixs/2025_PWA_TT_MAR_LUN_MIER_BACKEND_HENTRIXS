import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
    fk_id_workspace:       { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    fk_id_sender_member:   { type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceMember', required: true },
    fk_id_receiver_member: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceMember', required: true },
    content:    { type: String, required: true },
    edited:     { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model('DirectMessage', directMessageSchema);
