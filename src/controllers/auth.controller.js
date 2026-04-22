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
                message: 'Usuario registrado con éxito. Por favor, verifica tu correo electrónico.'
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
                    message: 'Ha ocurrido un error inesperado en el servidor. Inténtalo de nuevo más tarde.'
                });
            };
        };
    };

    async verifyEmail(req, res) {
        try {
            const { verify_email_token } = req.query;
            await authService.verifyEmail({ verify_email_token });
            res.status(200).json({ ok: true, status: 200, message: '¡Cuenta verificada! Ya puedes iniciar sesión.' });
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
                    message: 'Ha ocurrido un error inesperado en el servidor.'
                });
            };
        }
    };

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const auth_token = await authService.login({ email, password });
            return res.status(200).json({
                message: 'Sesión iniciada correctamente.',
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
                    message: 'Ha ocurrido un error inesperado.'
                });
            };
        };
    };

    async resetPasswordRequest(req, res) {
        try {
            const { email } = req.body;
            await authService.resetPasswordRequest({ email });
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña en unos minutos.'
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
                    message: 'Ha ocurrido un error inesperado.'
                });
            };
        };
    };

    async resetPassword(req, res) {
        try {
            const { reset_password_token } = req.params;
            const { new_password } = req.body;
            await authService.resetPassword({ reset_token: reset_password_token, new_password });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Tu contraseña ha sido actualizada con éxito."
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
    };

    async deleteAccount(req, res) {
        try {
            const { user } = req;
            const { password } = req.body;
            await authService.deleteAccount({ user_id: user.id, password });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Cuenta eliminada de forma permanente.'
            });
        } catch (err) {
            if (err instanceof ServerError) {
                return res.status(err.status).json({
                    ok: false,
                    status: err.status,
                    message: err.message
                });
            } else {
                return res.status(500).json({
                    ok: false,
                    status: 500,
                    message: 'Ha ocurrido un error inesperado.'
                });
            }
        }
    };

    async getProfile(req, res) {
        try {
            const { id } = req.user;
            const user_dto = await authService.getProfile({ user_id: id });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Perfil obtenido con éxito',
                data: user_dto
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
                    message: 'Ha ocurrido un error inesperado al obtener el perfil.'
                });
            };
        };
    };

    async updateProfile(req, res) {
        try {
            const { id } = req.user;
            const { name, description } = req.body;
            const user_updated_dto = await authService.updateProfile({ user_id: id, name, description });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Perfil actualizado con éxito',
                data: user_updated_dto
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
                    message: 'Ha ocurrido un error inesperado al actualizar el perfil.'
                });
            };
        };
    };

    async updatePassword(req, res) {
        try {
            const { id } = req.user;
            const { old_password, new_password } = req.body;
            await authService.updatePassword({ user_id: id, old_password, new_password });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Contraseña actualizada con éxito.'
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
                    message: 'Ha ocurrido un error inesperado al actualizar la contraseña.'
                });
            };
        };
    };

    async requestEmailChange(req, res) {
        try {
            const { id } = req.user;
            const { password, new_email } = req.body;
            await authService.requestEmailChange({ user_id: id, password, new_email });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Se ha enviado un correo de confirmación a tu nueva dirección.'
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
                    message: 'Error al solicitar el cambio de email.'
                });
            };
        };
    };

    async confirmEmailChange(req, res) {
        try {
            const { token } = req.params;
            await authService.confirmEmailChange({ token });
            // Redirigir al frontend con éxito
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}settings/email-confirmation-result?success=true`);
        } catch (err) {
            const message = err instanceof ServerError ? err.message : 'Error al confirmar el cambio de email.';
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}settings/email-confirmation-result?success=false&message=${encodeURIComponent(message)}`);
        };
    };

};


const authController = new AuthController();
export default authController