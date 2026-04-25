import { Router } from 'express';
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verifyMemberWorkspaceMiddleware.js';
import ChannelController from '../controllers/channel.controller.js';

const channelMessagesRouter = Router({ mergeParams: true });

// Note: authMiddleware / verifyWorkspaceMiddleware / verifyChannelMiddleware are handled by the parent router

channelMessagesRouter.get('/', ChannelController.getChannelMessagesHistory);
channelMessagesRouter.post('/', ChannelController.createChannelMessage);

channelMessagesRouter.delete('/:message_id', ChannelController.deleteMessageById);

channelMessagesRouter.patch('/:message_id',
    verifyMemberWorkspaceRoleMiddleware([]),
    ChannelController.updateMessageById
);

export default channelMessagesRouter;
