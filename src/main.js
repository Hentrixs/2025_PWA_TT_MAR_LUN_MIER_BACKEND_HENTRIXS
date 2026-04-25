import ENVIRONMENT from "./config/environment.config.js"
import cors from 'cors';
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import connectMongoDB from "./config/mongoDB.config.js"

import express from 'express';

import healthRouter from "./routes/health.router.js"
import authRouter from "./routes/auth.router.js"
import workspaceRouter from "./routes/workspace.router.js"
import invitationRouter from "./routes/invitation.router.js";

connectMongoDB()

const app = express()

app.use(cors());
app.use(express.json())

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/invitation', invitationRouter);

app.use(errorHandlerMiddleware);

app.listen(
    ENVIRONMENT.PORT,
    () => {
        console.log('La aplicacion se esta escuchando en el puerto ' + ENVIRONMENT.PORT)
    }
);
