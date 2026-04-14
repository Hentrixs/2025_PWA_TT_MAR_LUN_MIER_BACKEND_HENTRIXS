
import mongoose from "mongoose";
import AVAILABLE_MEMBER_ROLES from "../constants/roles.constant";
import ACCEPT_INVITATION_CONSTANTS from "../constants/acceptinvitation.constant";

const workspaceMemberSchema = new mongoose.Schema({
    fk_id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fk_id_workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    role: {
        type: String,
        enum: [
            AVAILABLE_MEMBER_ROLES.OWNER,
            AVAILABLE_MEMBER_ROLES.ADMIN,
            AVAILABLE_MEMBER_ROLES.USER
        ],
        default: AVAILABLE_MEMBER_ROLES.USER
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    acceptInvitation: {
        type: String,
        enum: [
            ACCEPT_INVITATION_CONSTANTS.ACCEPTED,
            ACCEPT_INVITATION_CONSTANTS.PENDING,
            ACCEPT_INVITATION_CONSTANTS.REJECTED
        ],
        default: ACCEPT_INVITATION_CONSTANTS.PENDING
    }
})

const WorkspaceMember = mongoose.model('WorkspaceMember', workspaceMemberSchema)

export default WorkspaceMember