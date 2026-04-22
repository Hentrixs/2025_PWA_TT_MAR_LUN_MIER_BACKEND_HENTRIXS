import express from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
const authRouter = express.Router()

authRouter.post(
    '/register',
    authController.register
)

authRouter.post(
    '/login',
    authController.login
)

authRouter.get(
    '/verify-email',
    authController.verifyEmail
)

authRouter.post(
    '/reset-password-request',
    authController.resetPasswordRequest
);

authRouter.post('/reset-password/:reset_password_token',
    authController.resetPassword
);

authRouter.put('/update_password',
    authMiddleware,
    authController.updatePassword
);


authRouter.delete('/delete-account',
    authMiddleware,
    authController.deleteAccount
);

authRouter.patch('/update-profile',

    authMiddleware,
    authController.updateProfile
);

authRouter.get('/profile',
    authMiddleware,
    authController.getProfile
);


authRouter.post('/request-email-change',
    authMiddleware,
    authController.requestEmailChange
);

authRouter.get('/confirm-email-change/:token',
    authController.confirmEmailChange
);

export default authRouter