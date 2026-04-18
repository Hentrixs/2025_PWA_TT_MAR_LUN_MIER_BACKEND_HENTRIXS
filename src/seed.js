import mongoose from 'mongoose';
import ENVIRONMENT from './config/environment.config.js';
import Workspace from './models/workspace.model.js';
import WorkspaceMember from './models/workspaceMember.model.js';

async function buildMembers() {
    try {
        await mongoose.connect(ENVIRONMENT.MONGO_URI);
        console.log('Conectado a la Base de Datos...');

        // Agarramos el primer Workspace que exista en tu DB
        const workspace = await Workspace.findOne();
        if (!workspace) {
            console.error('ERROR: No encontré ningún Workspace en tu base de datos.');
            return process.exit(1);
        }

        console.log(`Workspace encontrado: "${workspace.name}" con ID: ${workspace._id}`);

        const mikuriId = '69cc40593eff5f8dd609b6ee';
        const hentrixId = '69d1846d8a54628673f6ca45';

        // Borramos si ya habia algo por accidente
        await WorkspaceMember.deleteMany({ fk_id_user: { $in: [mikuriId, hentrixId] } });

        // Creamos a los dos como dueños y aceptados
        await WorkspaceMember.create([
            {
                fk_id_user: mikuriId,
                fk_id_workspace: workspace._id,
                role: 'owner',
                acceptInvitation: 'accepted'
            },
            {
                fk_id_user: hentrixId,
                fk_id_workspace: workspace._id,
                role: 'owner',
                acceptInvitation: 'accepted'
            }
        ]);

        console.log('✅ ¡Magia completada! Ambos usuarios ahora son dueños oficiales del Workspace.');
        process.exit(0);
    } catch (error) {
        console.error('Error insertando miembros:', error);
        process.exit(1);
    }
}

buildMembers();
