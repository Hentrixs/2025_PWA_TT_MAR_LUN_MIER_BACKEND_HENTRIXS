import ENVIRONMENT from "./config/environment.config.js"
import cors from 'cors';
import connectMongoDB from "./config/mongoDB.config.js"

import express from 'express';

import authMiddleware from "./middlewares/authMiddleware.js"
import User from "./models/user.model.js";
import Workspace from "./models/workspace.model.js";
import WorkspaceMember from "./models/workspaceMember.model.js";

import healthRouter from "./routes/health.router.js"
import authRouter from "./routes/auth.router.js"
import channelRouter from "./routes/channel.router.js";
import workspaceRouter from "./routes/workspace.router.js"
import channelMessagesRouter from "./routes/channelMessages.router.js";

connectMongoDB()


const app = express()

app.use(cors());
app.use(express.json())

/* 
Delegamos las consultas que vengan sobre '/api/health' al healthRouter
*/

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/channel', channelRouter);
app.use('/api/channelMessages', channelMessagesRouter);

// Ejemplo de implementacion de middleware en main.js
// Notese qeu incluso podemos insertar otro middleware mas en el medio
// esto se ejecuta en orden sincronico de izquierda a derecha.
/*
app.use('/api/test', authMiddleware, (req, res, next) => { console.log('Soy otro middleware'); next(); }, (req, res) => { res.send('ok') })
*/
// la razon de porque queremos un middleware es porque tendremos muchas rutas 
// y en cada una de esas rutas necesitamos saber si esta loggeado, 
// y de esa tarea de encarga el middleware 

//Implementacion real.
app.get('/api/test', authMiddleware, (req, res) => {
    // ¿Cómo pasan los datos sin un return?
    // Porque tanto el middleware como esta función acceden al MISMO objeto "req" en la memoria RAM.
    // Lo que sea que modifiques del "req" en el middleware (ej. req.user = payload),
    // queda guardado en ese mismo "req" que recibe esta función a continuación.
    const { user } = req;

    console.log('USER: ', user.id);

    // res.send no soporta separar textos con coma como sí lo hace console.log()
    // Para juntarlo en un envío necesitas concatenarlo (o usar backticks `` como abajo)
    res.send(`ok, vos sos: ${user.id}`);
});

app.get('/api/seed', async (req, res) => {
    try {
        const user = await User.findOne({});
        if (!user) return res.send("No hay usuarios");
        const workspace = await Workspace.create({ title: "Mock", description: "Mock desc" });
        await WorkspaceMember.create({ fk_id_workspace: workspace._id, fk_id_user: user._id, role: 'admin' });
        res.send("Seed listo!");
    } catch (e) { res.send(e.message); }
});

app.listen(
    ENVIRONMENT.PORT,
    () => {
        console.log('La aplicacion se esta escuchando en el puerto ' + ENVIRONMENT.PORT)
    }
);
