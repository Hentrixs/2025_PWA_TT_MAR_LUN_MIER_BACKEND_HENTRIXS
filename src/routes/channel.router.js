import { Router } from 'express';
import ChannelController from '../controllers/channel.controller.js';
import verifyMemberWorkspaceRoleMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";

const channelRouter = Router({ mergeParams: true });

// este channelRouter esta encastrado al workspace router el cual ya tiene el authMiddleware, no hace falta meterlo aca.

channelRouter.post('/', verifyMemberWorkspaceRoleMiddleware(["owner", "admin"]), ChannelController.createChannel);
channelRouter.get('/', ChannelController.getChannelByWorkspaceId);
channelRouter.delete('/:channel_id', ChannelController.deleteChannelById)
export default channelRouter;