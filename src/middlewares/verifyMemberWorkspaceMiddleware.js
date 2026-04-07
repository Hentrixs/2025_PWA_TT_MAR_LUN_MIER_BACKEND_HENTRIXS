import workspaceMemberRepository from '../repository/member.repository.js';
import ServerError from '../helpers/error.helper.js';

const verifyMemberWorkspaceMiddleware = async (req, res, next) => {
    try {
        const { workspace_id } = req.params;
        const { user } = req;
        const wsMember = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user.id);

        if (!wsMember) {
            throw new ServerError('No eres miembro de este workspace', 403);
        } else {
            req.member = wsMember;
            next();
        };

    } catch (err) {
        if (err instanceof ServerError) {
            return res.status(err.status).json({ ok: false, status: err.status, message: err.message });
        }
        return res.status(500).json({ ok: false, status: 500, message: 'Internal Server Error.' });
    }
};

export default verifyMemberWorkspaceMiddleware;
