
import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    url_image: {
        type: String,
    },
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;