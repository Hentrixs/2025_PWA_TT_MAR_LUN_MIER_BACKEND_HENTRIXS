import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import authService from "../services/auth.service.js";

class AuthController {

    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            await authService.register({ name, email, password });
            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'El usuario se ha creado correctamente'
            })
        } catch (err) {
            if (err instanceof ServerError) {
                res.status(err.status).json({
                    ok: false,
                    status: err.status,
                    message: err.message
                });
            } else {
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Internal Server Error.'
                });
            };
        };
    };

    async verifyEmail(req, res) {
        try {
            const { verify_email_token } = req.query;
            await authService.verifyEmail({ verify_email_token });
            res.status(200).json({ ok: true, status: 200, message: 'Email verificado exitosamente' });
        } catch (err) {
            if (err instanceof ServerError) {
                res.status(err.status).json({
                    ok: false,
                    status: err.status,
                    message: err.message
                });
            } else {
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Internal Server Error.'
                });
            };
        }
    };

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const auth_token = await authService.login({ email, password });
            return res.status(200).json({
                message: 'Login successfull',
                status: 200,
                ok: true,
                data: {
                    auth_token
                }
            });
        } catch (err) {
            if (err instanceof ServerError) {
                res.status(err.status).json({
                    ok: false,
                    status: err.status,
                    message: err.message
                });
            } else {
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Internal Server Error.'
                });
            };
        };
    };

    async resetPasswordRequest(req, res) {
        try {
            const { email } = req.body;
            await authService.resetPasswordRequest({ email });
            res.status(201).json({
                ok: true,
                status: 201,
                message: 'Solicitud de Reset de Password enviada'
            });
        } catch (err) {
            if (err instanceof ServerError) {
                res.status(err.status).json({
                    ok: false,
                    status: err.status,
                    message: err.message
                });
            } else {
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Internal Server Error'
                });
            };
        };
    };

    async resetPassword(req, res) {
        try {
            const { reset_token } = req.params;
            const { new_password } = req.body;
            await authService.resetPassword({ reset_token, new_password });
            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Password reseted"
            });
        } catch (err) {
            if (err instanceof ServerError) {
                res.status(err.status).json({
                    ok: false,
                    status: err.status,
                    message: err.message
                });
            } else {
                res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Internal Server Error'
                });
            };
        }
    }
};

const authController = new AuthController();
export default authController