
import { Router } from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const workspaceRouter = Router();

workspaceRouter.get('/', authMiddleware, WorkspaceController.getWorkspaces);
workspaceRouter.post('/', authMiddleware, WorkspaceController.create);

export default workspaceRouter;