
class workspaceDTO {
    constructor(workspace) {
        this.workspace_id = workspace._id;
        this.workspace_name = workspace.name;
        this.workspace_title = workspace.title;
        this.workspace_description = workspace.description;
        this.workspace_url_image = workspace.url_image;
    };
};

export default workspaceDTO;