import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import ChannelController from '../controllers/channel.controller.js';

const channelRouter = Router();

channelRouter.post('/', authMiddleware, ChannelController.createChannel);
channelRouter.get('/', authMiddleware, ChannelController.getChannelByWorkspaceId);
export default channelRouter;