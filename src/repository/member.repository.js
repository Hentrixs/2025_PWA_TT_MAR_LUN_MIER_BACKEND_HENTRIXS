import ServerError from "../helpers/error.helper.js";
import WorkspaceMember from "../models/workspaceMember.model.js";
import "../models/workspace.model.js";
import ACCEPT_INVITATION_CONSTANTS from "../constants/acceptinvitation.constant.js";


class WorkspaceMemberRepository {
    async create(fk_id_workspace, fk_id_user, role) {

        if (!fk_id_workspace || !fk_id_user || !role) {
            throw new ServerError('Faltan Credenciales', 400); // no em acuerdo el status de aca fck.
        };

        const workspace = await WorkspaceMember.create({
            fk_id_workspace: fk_id_workspace,
            fk_id_user: fk_id_user,
            role: role
        });

    };

    async deleteById(workspace_member_id) {
        if (!workspace_member_id) {
            throw new ServerError('Faltan Credenciales', 400);
        };
        await WorkspaceMember.findByIdAndDelete(workspace_member_id)
    };

    async getById(workspace_member_id) {
        if (!workspace_member_id) {
            throw new ServerError('Faltan Credenciales', 400);
        };
        const workspace = await WorkspaceMember.findById(workspace_member_id)
        return workspace;
    };

    async updateRoleById(member_id, role) {
        if (!member_id || !role) {
            throw new ServerError('Faltan Credenciales', 400);
        };
        const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            { role: role },
            { new: true }
        );
        return new_workspace_member;
    };

    async getAll() {
        const workspaces = await WorkspaceMember.find();
        return workspaces;
    };

    async getMemberList(fk_id_workspace) {
        if (!fk_id_workspace) {
            throw new ServerError('Faltan Credenciales', 400);
        };

        /*
        // Esta es una de las cosas que mas me cuestan, voy a dejar esto anotado para que no se me olvide.
        
        con el metodo populate podemos traer los datos relacionados a las referencias que tenemos en el modelo, 
        en este caso fk_id_user y fk_id_workspace.
        Entonces si quiero traer el nombre de usuario de cada miembro podria hacer un populate de fk_id_user y 
        seleccionar solo el campo name, quedando asi:
        */

        const members = await WorkspaceMember.find({ fk_id_workspace: fk_id_workspace })
            .populate('fk_id_user', 'name email')
            .populate('fk_id_workspace', 'title description')

        const members_mapped = members.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_created_at: member.created_at,

                    user_id: member.fk_id_user._id,
                    user_name: member.fk_id_user.name,
                    user_email: member.fk_id_user.email,

                    workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_description: member.fk_id_workspace.description
                }
            }
        )
        return members_mapped
    };

    async getByWorkspaceAndUserId(workspace_id, user_id) {
        if (!workspace_id || !user_id) throw new ServerError('Faltan Credenciales', 400);
        return await WorkspaceMember.findOne({ fk_id_workspace: workspace_id, fk_id_user: user_id });
    };

    async getWorkspaceListByUserId(user_id) {
        if (!user_id) {
            throw new ServerError('Faltan Credenciales', 400);
        };

        const members = await WorkspaceMember.find({ fk_id_user: user_id }).populate('fk_id_workspace');
        // no puse un if > ServerError() aca porque el que este vacio no es un error como tal.

        const validMembers = members.filter(
            (member) => member.fk_id_workspace != null
        );

        const workspaces = validMembers.map((member) => ({
            _id: member.fk_id_workspace._id,
            name: member.fk_id_workspace.title,
            member_id: member._id
        }));

        return workspaces;
    };

    async isMemberPartOfWorkspaceById(user_id, workspace_id) {
        if (!user_id || !workspace_id) throw new ServerError('Faltan Credenciales', 400);
        return await WorkspaceMember.findOne({ fk_id_user: user_id, fk_id_workspace: workspace_id });
    };

    async updateInvitationStatus(member_id, status) {
        if (!member_id || !status) {
            throw new ServerError('Faltan datos para actualizar el estado', 400);
        };
        const updatedMember = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            { acceptInvitation: status },
            { new: true }
        );
        return updatedMember;
    };
};
const workspaceMemberRepository = new WorkspaceMemberRepository();
export default workspaceMemberRepository;