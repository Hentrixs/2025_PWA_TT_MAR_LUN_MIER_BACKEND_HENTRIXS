import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import ChannelMessagesController from '../controllers/channelmessage.controller.js';

const channelMessagesRouter = Router();

channelMessagesRouter.get('/', authMiddleware, ChannelMessagesController.getChannelMessagesHistory);
channelMessagesRouter.post('/', authMiddleware, ChannelMessagesController.createChannelMessage);

export default channelMessagesRouter;
