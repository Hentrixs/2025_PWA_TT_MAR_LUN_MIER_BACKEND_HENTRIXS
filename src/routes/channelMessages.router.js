import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import ChannelController from '../controllers/channel.controller.js';

const channelMessagesRouter = Router();

channelMessagesRouter.get('/', authMiddleware, ChannelController.getChannelMessagesHistory);
channelMessagesRouter.post('/', authMiddleware, ChannelController.createChannelMessage);

export default channelMessagesRouter;
