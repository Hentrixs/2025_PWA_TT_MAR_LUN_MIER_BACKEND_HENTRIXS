import express from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js';
import validateBody, { validateEmail } from '../middlewares/validateBody.middleware.js';

const authRouter = express.Router()

authRouter.post(
    '/register',
    validateBody(['name', 'email', 'password']),
    validateEmail(),
    authController.register
)

authRouter.post(
    '/login',
    validateBody(['email', 'password']),
    validateEmail(),
    authController.login
)

authRouter.get(
    '/verify-email',
    authController.verifyEmail
)

authRouter.post(
    '/reset-password-request',
    validateBody(['email', 'new_password']),
    validateEmail(),
    authController.resetPasswordRequest
);

authRouter.get('/reset-password/:reset_password_token',
    authController.resetPasswordConfirm
);

authRouter.put('/update_password',
    authMiddleware,
    validateBody(['old_password', 'new_password']),
    authController.updatePassword
);

authRouter.delete('/delete-account',
    authMiddleware,
    validateBody(['password']),
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
    validateBody(['password', 'new_email']),
    validateEmail('new_email'),
    authController.requestEmailChange
);

authRouter.get('/confirm-email-change/:token',
    authController.confirmEmailChange
);

authRouter.patch('/update-language',
    authMiddleware,
    validateBody(['language']),
    authController.updateLanguage
);

export default authRouter;