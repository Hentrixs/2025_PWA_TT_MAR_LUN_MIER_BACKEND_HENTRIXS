
import { Router } from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import verifyMemberWorkspaceRoleMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";
import channelRouter from "./channel.router.js";
import workspaceMemberRouter from "./workspaceMember.router.js";
import directMessageRouter from "./directMessage.router.js";
import validateBody from "../middlewares/validateBody.middleware.js";

const workspaceRouter = Router();

workspaceRouter.use(authMiddleware);

workspaceRouter.get('/', WorkspaceController.getWorkspaces);
workspaceRouter.post('/', validateBody(['title']), WorkspaceController.create);

workspaceRouter.get('/:workspace_id/workspaceDetail',
    verifyMemberWorkspaceRoleMiddleware([]),
    WorkspaceController.getWorkspaceDetail
);

workspaceRouter.use('/:workspace_id/channel', verifyMemberWorkspaceRoleMiddleware([]), channelRouter);

workspaceRouter.use('/:workspace_id/member', workspaceMemberRouter);
workspaceRouter.use('/:workspace_id/dm', verifyMemberWorkspaceRoleMiddleware([]), directMessageRouter);

workspaceRouter.patch('/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    WorkspaceController.updateById
);

workspaceRouter.delete('/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware(['owner']),
    WorkspaceController.deleteById
);


export default workspaceRouter;