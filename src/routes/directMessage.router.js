import { Router } from 'express';
import DirectMessageController from '../controllers/directMessage.controller.js';
import validateBody from '../middlewares/validateBody.middleware.js';

const directMessageRouter = Router({ mergeParams: true });

directMessageRouter.get('/:other_member_id', DirectMessageController.getConversation);
directMessageRouter.post('/:other_member_id', validateBody(['content']), DirectMessageController.sendMessage);
directMessageRouter.patch('/:other_member_id/message/:message_id', validateBody(['content']), DirectMessageController.updateMessage);

export default directMessageRouter;
