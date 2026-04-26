
import ServerError from "../helpers/error.helper.js";
import WorkspaceModel from "../models/workspace.model.js";
import ChannelRepository from "./channel.repository.js";
class WorkspaceRepository {

    async create(title, description, url_image, active) {
        if (!title) {
            throw new ServerError('Faltan credenciales', 400);
        };
        const workspace = await WorkspaceModel.create({
            title: title,
            description: description,
            url_image,
            active
        });
        await ChannelRepository.create(workspace._id, 'General', 'Canal general del espacio de trabajo');

        return workspace;
    };

    async deleteById(workspace_id) {
        if (!workspace_id) {
            throw new ServerError('Faltan credenciales', 400);
        };
        await WorkspaceModel.findByIdAndDelete(workspace_id);
    };

    async getById(workspace_id) {
        if (!workspace_id) {
            throw new ServerError('Faltan credenciales', 400);
        };
        return await WorkspaceModel.findById(workspace_id)
    };

    async updateById(workspace_id, title, description, url_image) {
        if (!workspace_id) {
            throw new ServerError('Faltan credenciales', 400);
        };

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (url_image !== undefined) updates.url_image = url_image;

        const updated_workspace = await WorkspaceModel.findByIdAndUpdate(
            workspace_id,
            updates,
            { returnDocument: 'after' }
        );
        if (!updated_workspace) throw new ServerError('Workspace no encontrado', 404);
        return updated_workspace;
    };

}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository;


/* 
Para manejar asincronia en JS existen 3 formas comunes:

Con callbacks:
Cuando la funcion acabe la accion se ejecutara la callback
Cuando termines de pensar decime tu idea

sincronizarPDF(
    (result) => {
        console.log('El pdf sincronizado es ' , result)
        enviarMailNotificacion(
            (result) => {
                console.log("mail enviado")
            }
        )
    }
)

Con async / await (La mas recomendada):
Cuando la la promesa se resuelve el resto de codigo que sigue al await se ejecuta
Aguardare a que termines de pensar y ahi dime tu idea

const result = await sincronizarPDF()
console.log('El pdf sincronizado es ' , result)
const mail_result = await enviarMailNotificacion()
console.log("mail enviado")


Con then y catch:
Las promesas tienen acceso al metodo .then y .catch. .then se ejecutara cuando la promesa se resuelva, a su vez then recibe una callback que es la accion que tendra que ejecutar cuando termine de resolverse la promesa. El catch se activa si hay un error en la promesa y tambien recibe una callback que se ejecutara si hay error.

sincronizarPDF()
.then(
    (result) => {
        console.log('El pdf sincronizado es ' , result)
        enviarMailNotificacion().then(
            (result) => {
                console.log("mail enviado")
            }
        )
    }
)

*/

