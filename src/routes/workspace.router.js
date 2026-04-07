
import { Router } from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import verifyMemberWorkspaceMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";
const workspaceRouter = Router();

workspaceRouter.get('/', authMiddleware, WorkspaceController.getWorkspaces);
workspaceRouter.post('/', authMiddleware, WorkspaceController.create);
workspaceRouter.get('/:workspace_id', authMiddleware, verifyMemberWorkspaceMiddleware, WorkspaceController.getWorkspaceDetail);

export default workspaceRouter;