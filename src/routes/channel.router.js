import { Router } from 'express';
import ChannelController from '../controllers/channel.controller.js';
import verifyMemberWorkspaceRoleMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";
import verifyWorkspaceMiddleware from '../middlewares/verifyWorkspace.middleware.js';
import verifyChannelMiddleware from '../middlewares/verifyChannel.middleware.js';
import channelMessagesRouter from './channelMessages.router.js';
import validateBody from '../middlewares/validateBody.middleware.js';

const channelRouter = Router({ mergeParams: true });

channelRouter.post('/',
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceRoleMiddleware(["owner", "admin"]),
    validateBody(['name']),
    ChannelController.createChannel
);

channelRouter.get('/',
    verifyWorkspaceMiddleware,
    ChannelController.getChannelByWorkspaceId
);

channelRouter.delete('/:channel_id',
    verifyWorkspaceMiddleware,
    verifyChannelMiddleware,
    ChannelController.deleteChannelById
);

channelRouter.use('/:channel_id/message',
    verifyWorkspaceMiddleware,
    verifyChannelMiddleware,
    channelMessagesRouter
);

channelRouter.patch('/:channel_id/',
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    verifyChannelMiddleware,
    ChannelController.updateChannelById
);

export default channelRouter;