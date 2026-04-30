import authService from "../services/auth.service.js";
import ENVIRONMENT from "../config/environment.config.js";
import ServerError from "../helpers/error.helper.js";
import { getRequestLanguage } from "../helpers/lang.helper.js";
import { translate } from "../helpers/translation.helper.js";

class AuthController {

    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const lang = getRequestLanguage(req);
            await authService.register({ name, email, password, lang });
            return res.status(201).json({
                ok: true,
                status: 201,
                message: translate('Usuario registrado con éxito. Por favor, verifica tu correo electrónico.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { verify_email_token } = req.query;
            const lang = getRequestLanguage(req);
            await authService.verifyEmail({ verify_email_token });
            res.status(200).json({ ok: true, status: 200, message: translate('¡Cuenta verificada! Ya puedes iniciar sesión.', lang) });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const lang = getRequestLanguage(req);
            const { auth_token, user_language } = await authService.login({ email, password });
            return res.status(200).json({
                message: translate('Sesión iniciada correctamente.', lang),
                status: 200,
                ok: true,
                data: { auth_token, user_language }
            });
        } catch (err) {
            next(err);
        }
    }

    async resetPasswordRequest(req, res, next) {
        try {
            const { email, new_password } = req.body;
            const lang = getRequestLanguage(req);
            await authService.resetPasswordRequest({ email, new_password, lang });
            res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Si el correo existe, recibirás un enlace para confirmar el restablecimiento en unos minutos.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async resetPasswordConfirm(req, res) {
        try {
            const { reset_password_token } = req.params;
            await authService.resetPasswordConfirm({ reset_token: reset_password_token });
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}reset-password-result?success=true`);
        } catch (err) {
            const message = err instanceof ServerError ? err.message : 'Error al restablecer la contraseña.';
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}reset-password-result?success=false&message=${encodeURIComponent(message)}`);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const { user } = req;
            const { password } = req.body;
            const lang = getRequestLanguage(req);
            await authService.deleteAccount({ user_id: user.id, password });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Cuenta eliminada de forma permanente.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async getProfile(req, res, next) {
        try {
            const { id } = req.user;
            const lang = getRequestLanguage(req);
            const user_dto = await authService.getProfile({ user_id: id });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Perfil obtenido con éxito', lang),
                data: user_dto
            });
        } catch (err) {
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { id } = req.user;
            const { name, description } = req.body;
            const lang = getRequestLanguage(req);
            const user_updated_dto = await authService.updateProfile({ user_id: id, name, description });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Perfil actualizado con éxito', lang),
                data: user_updated_dto
            });
        } catch (err) {
            next(err);
        }
    }

    async updatePassword(req, res, next) {
        try {
            const { id } = req.user;
            const { old_password, new_password } = req.body;
            const lang = getRequestLanguage(req);
            await authService.updatePassword({ user_id: id, old_password, new_password });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Contraseña actualizada con éxito.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async requestEmailChange(req, res, next) {
        try {
            const { id } = req.user;
            const { password, new_email } = req.body;
            const lang = getRequestLanguage(req);
            await authService.requestEmailChange({ user_id: id, password, new_email, lang });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Se ha enviado un correo de confirmación a tu nueva dirección.', lang)
            });
        } catch (err) {
            next(err);
        }
    }

    async confirmEmailChange(req, res) {
        try {
            const { token } = req.params;
            await authService.confirmEmailChange({ token });
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}settings/email-confirmation-result?success=true`);
        } catch (err) {
            const message = err instanceof ServerError ? err.message : 'Error al confirmar el cambio de email.';
            return res.redirect(`${ENVIRONMENT.URL_FRONTEND}settings/email-confirmation-result?success=false&message=${encodeURIComponent(message)}`);
        }
    }

    async updateLanguage(req, res, next) {
        try {
            const { id } = req.user;
            const { language } = req.body;
            const lang = getRequestLanguage(req);
            await authService.updateLanguage({ user_id: id, language });
            return res.status(200).json({
                ok: true,
                status: 200,
                message: translate('Idioma actualizado con éxito.', lang)
            });
        } catch (err) {
            next(err);
        }
    }
}

const authController = new AuthController();
export default authController;
