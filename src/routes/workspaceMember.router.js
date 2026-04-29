import { Router } from "express";
import WorkspaceMemberController from "../controllers/workspaceMember.controller.js";
import verifyWorkspaceMiddleware from "../middlewares/verifyWorkspace.middleware.js";
import verifyMemberWorkspaceRoleMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";
import validateBody, { validateEmail } from "../middlewares/validateBody.middleware.js";

const workspaceMemberRouter = Router({ mergeParams: true });
workspaceMemberRouter.get('/',
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceRoleMiddleware([]),
    WorkspaceMemberController.getMemberList
);

workspaceMemberRouter.delete('/:member_id',
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceRoleMiddleware([]),
    WorkspaceMemberController.deleteMember
);

workspaceMemberRouter.put('/:member_id',
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    validateBody(['role']),
    WorkspaceMemberController.updateRole
);

workspaceMemberRouter.post('/invite',
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    validateBody(['email', 'role']),
    validateEmail(),
    WorkspaceMemberController.inviteMember
);


export default workspaceMemberRouter;
