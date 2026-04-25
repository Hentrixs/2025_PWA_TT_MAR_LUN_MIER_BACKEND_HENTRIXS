import { Router } from "express";
import WorkspaceMemberController from "../controllers/workspaceMember.controller.js";
import verifyWorkspaceMiddleware from "../middlewares/verifyWorkspace.middleware.js";
import verifyMemberWorkspaceRoleMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";
import validateBody, { validateEmail } from "../middlewares/validateBody.middleware.js";

// mergeParams: true es fundamental para que este router pueda leer el :workspace_id de su padre.
const workspaceMemberRouter = Router({ mergeParams: true });

// NOTA: Todas estas rutas asumen que vienen empalmadas desde /api/workspace/:workspace_id/member

// Obtener lista de miembros (Cualquier miembro del workspace puede hacerlo)
workspaceMemberRouter.get('/',
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceRoleMiddleware([]),
    WorkspaceMemberController.getMemberList
);

// Eliminar miembro (Solo admins/owners o uno mismo)
workspaceMemberRouter.delete('/:member_id',
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceRoleMiddleware([]),
    WorkspaceMemberController.deleteMember
);

// Actualizar rol de un miembro (Solo owners o admins pueden promover/degradar)
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
