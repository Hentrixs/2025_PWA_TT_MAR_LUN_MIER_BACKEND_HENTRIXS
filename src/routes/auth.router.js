import express from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
const authRouter = express.Router()

authRouter.post(
    '/register',
    authController.register // esto anda
)

authRouter.post(
    '/login',
    authController.login // esto anda
)

authRouter.get(
    '/verify-email',
    authController.verifyEmail // esto anda
)

authRouter.post( // la url que envia el email esta mala despues arreglarla. de todas formas esto se ejecuta
    '/reset-password-request',      // este anda tambien, solo falta fixear tema de arriba
    authController.resetPasswordRequest
);

authRouter.post('/reset-password/:reset_password_token', 
    authController.resetPassword
); // perfecto, esto anda joya.

authRouter.delete('/delete-account', 
    authMiddleware, 
    authController.deleteAccount
);


export default authRouter