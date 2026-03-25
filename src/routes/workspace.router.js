
/*
GET /api/workspace 
Trae todos los espacios de trabajo asociados al usuario
Para saber que espacios de trabajo traer necesitamos el ID del usuario
Para saber que espacios de trabajo traer necesitamos el ID del usuario
*/

/* 
Para hacer esto haremos:
- un GET a la direccion mencionada que pase el auth_token

- de ese auth_token la API obtendra el id del usuario 
*/

import { Router } from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const workspaceRouter = Router();

workspaceRouter.get('/', authMiddleware, WorkspaceController.getWorkspaces);

export default workspaceRouter;