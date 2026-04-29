import { Router } from "express";
import workspaceMemberController from "../controllers/workspaceMember.controller.js";

const invitationRouter = Router();

// Public route for invitation links (no Auth required)
invitationRouter.get('/respond', workspaceMemberController.respondToInvitation);

export default invitationRouter;
