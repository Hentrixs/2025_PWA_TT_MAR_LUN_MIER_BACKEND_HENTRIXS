import { Router } from "express";
import workspaceMemberController from "../controllers/workspaceMember.controller.js";

const invitationRouter = Router();

// La razon por la que no meti esto en workspaceMember.router.js es porque 
// esta ruta tiene que ser pública porque los navegadores no envían encabezados Authorization
// al hacer clic directamente en un enlace de correo.
// con lo cual si usaba esto en workspaceMember.router.js el authMiddleware iba a tirar un error

invitationRouter.get('/respond', workspaceMemberController.respondToInvitation);

export default invitationRouter;
