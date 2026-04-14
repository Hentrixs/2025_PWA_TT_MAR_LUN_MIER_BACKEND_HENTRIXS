import { Router } from 'express';
import ChannelController from '../controllers/channel.controller.js';
import verifyMemberWorkspaceRoleMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";
import verifyWorkspaceMiddleware from '../middlewares/verifyWorkspace.middleware.js';
import verifyChannelMiddleware from '../middlewares/verifyChannel.middleware.js';

const channelRouter = Router({ mergeParams: true });

// este channelRouter esta encastrado al workspace router el cual ya tiene el authMiddleware, no hace falta meterlo aca.

channelRouter.post('/', verifyWorkspaceMiddleware, verifyMemberWorkspaceRoleMiddleware(["owner", "admin"]), ChannelController.createChannel);
channelRouter.get('/', verifyWorkspaceMiddleware, ChannelController.getChannelByWorkspaceId);
channelRouter.delete('/:channel_id', verifyWorkspaceMiddleware, verifyChannelMiddleware, ChannelController.deleteChannelById)

channelRouter.post('/:channel_id/message', verifyWorkspaceMiddleware, verifyChannelMiddleware, ChannelController.createChannelMessage);
channelRouter.get('/:channel_id/message', verifyWorkspaceMiddleware, verifyChannelMiddleware, ChannelController.getChannelMessagesHistory);

export default channelRouter;