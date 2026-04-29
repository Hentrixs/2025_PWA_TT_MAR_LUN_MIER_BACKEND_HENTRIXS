import jwt from 'jsonwebtoken';
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/mailer.config.js";
import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from 'bcrypt';
import userDTO from '../dto/user.dto.js';
import workspaceMemberRepository from '../repository/member.repository.js';
import { getVerificationEmailTemplate, getResetPasswordEmailTemplate, getEmailChangeEmailTemplate } from '../helpers/emailTemplates.helper.js';



class AuthService {
    async register({ name, email, password }) {
        if (!name || !email || !password) {
            throw new ServerError('Todos los campos son obligatorios: nombre, email y contraseña.', 400);
        };

        const userByEmail = await userRepository.getByEmail(email);
        if (userByEmail) {
            throw new ServerError('Este correo electrónico ya se encuentra registrado.', 400);
        };

        const userByName = await userRepository.getByUsername(name);
        if (userByName) {
            throw new ServerError('El nombre de usuario elegido ya está en uso.', 400);
        };

        const hashedPassword = await bcrypt.hash(password, 12);
        await userRepository.create(name, email, hashedPassword);
        await this.sendVerifyEmail({ email, name });
    };

    async sendVerifyEmail({ email, name }) {
        const verifyEmailToken = jwt.sign({ email: email, name: name }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: '5d' });
        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: `Bienvenido ${name}, verifica tu correo electrónico`,
            html: getVerificationEmailTemplate(name, `${ENVIRONMENT.URL_FRONTEND}verify-email?verify_email_token=${verifyEmailToken}`)
        })
    };

    async verifyEmail({ verify_email_token }) {
        if (!verify_email_token) {
            throw new ServerError('Token de verificación no encontrado.', 400);
        };
        try {
            const { email, name } = jwt.verify(verify_email_token, ENVIRONMENT.JWT_SECRET_KEY);
            const user = await userRepository.getByEmail(email);
            if (!user) {
                throw new ServerError('El usuario no pudo ser localizado.', 404);
            } else if (user.email_verified) {
                throw new ServerError('Esta cuenta ya ha sido verificada previamente.', 400);
            } else {
                const user_updated = await userRepository.updateById(user._id, { email_verified: true });

                if (!user_updated.email_verified) {
                    throw new ServerError('Error al actualizar el estado de verificación. Inténtalo de nuevo.', 500);
                } else {
                    return user_updated
                }

            };
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                const { email, name } = jwt.decode(verify_email_token);
                await this.sendVerifyEmail({ email, name });
                throw new ServerError('El enlace de verificación ha expirado. Te hemos enviado uno nuevo a tu correo.', 401)
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw new ServerError('El enlace de verificación es inválido o está dañado.', 401);
            } else {
                throw err;
            };
        };
    };

    async login({ email, password }) {
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Credenciales inválidas. Verifica tu correo y contraseña.', 401);
        }
        if (!user.email_verified) {
            throw new ServerError('Tu cuenta aún no ha sido verificada. Revisa tu bandeja de entrada.', 401);
        }
        const is_same_password = await bcrypt.compare(password, user.password);


        if (!is_same_password) {
            throw new ServerError('Credenciales inválidas. Verifica tu correo y contraseña.', 401);
        }

        const auth_token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                id: user._id,
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: "30d" }
        );
        return auth_token;
    };

    async resetPasswordRequest({ email, new_password }) {
        if (!email || !new_password) {
            throw new ServerError('Email y nueva contraseña son obligatorios.', 400)
        };

        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Si el correo existe, recibirás un enlace para restablecer tu contraseña.', 404);
        };

        const hashed_password = await bcrypt.hash(new_password, 12);
        const auth_token = jwt.sign({ email, hashed_password }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: "1d" });

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: 'Restablecer Contraseña - GreenSlack',
            html: getResetPasswordEmailTemplate(`${ENVIRONMENT.URL_BACKEND}api/auth/reset-password/${auth_token}`),
        });
        return;
    };

    async resetPasswordConfirm({ reset_token }) {
        if (!reset_token) {
            throw new ServerError('Token no proporcionado.', 400);
        }
        try {
            const payload = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET_KEY);
            const user = await userRepository.getByEmail(payload.email);

            if (!user) {
                throw new ServerError('El usuario asociado a esta petición ya no existe', 404);
            };

            await userRepository.updateById(user._id, { password: payload.hashed_password });

        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new ServerError('El enlace ha expirado. Por favor, solicita uno nuevo.', 401);
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw new ServerError('El enlace es inválido o se encuentra dañado.', 401);
            } else {
                throw err;
            }
        };

    };

    async deleteAccount({ user_id, password }) {
        const user = await userRepository.getById(user_id);
        if (!user) throw new ServerError('Usuario no encontrado.', 404);

        const is_same_password = await bcrypt.compare(password, user.password);
        if (!is_same_password) throw new ServerError('Contraseña incorrecta.', 401);

        await workspaceMemberRepository.deleteMembersByUserId(user_id);
        await userRepository.deleteById(user_id);
    };

    async getProfile({ user_id }) {
        const user = await userRepository.getById(user_id);
        return new userDTO(user);
    };

    async updateProfile({ user_id, name, description }) {
        const user = await userRepository.getById(user_id);
        if (!user) throw new ServerError('Usuario no encontrado.', 404);

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const updated_user = await userRepository.updateById(user_id, updateData);
        return new userDTO(updated_user);
    };

    async updatePassword({ user_id, old_password, new_password }) {
        if (!old_password || !new_password) {
            throw new ServerError('Faltan credenciales.', 400);
        }

        const user = await userRepository.getById(user_id);
        if (!user) throw new ServerError('Usuario no encontrado.', 404);

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            throw new ServerError('La contraseña actual es incorrecta.', 401);
        }

        const hashedPassword = await bcrypt.hash(new_password, 12);

        await userRepository.updatePassword(user_id, hashedPassword);
    };

    async requestEmailChange({ user_id, password, new_email }) {
        if (!password || !new_email) {
            throw new ServerError('Faltan datos técnicos (contraseña o email).', 400);
        }

        const user = await userRepository.getById(user_id);
        if (!user) throw new ServerError('Usuario no encontrado.', 404);

        const is_same_password = await bcrypt.compare(password, user.password);
        if (!is_same_password) throw new ServerError('La contraseña actual es incorrecta.', 401);

        const existingUser = await userRepository.getByEmail(new_email);
        if (existingUser) throw new ServerError('Este correo electrónico ya está registrado por otro usuario.', 400);

        const emailChangeToken = jwt.sign(
            { user_id, new_email },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: new_email,
            subject: 'Confirma tu nuevo correo electrónico - GreenSlack',
            html: getEmailChangeEmailTemplate(`${ENVIRONMENT.URL_BACKEND}api/auth/confirm-email-change/${emailChangeToken}`)
        });
    };

    async confirmEmailChange({ token }) {
        if (!token) throw new ServerError('Token no proporcionado.', 400);

        try {
            const { user_id, new_email } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);

            const user = await userRepository.getById(user_id);
            if (!user) throw new ServerError('Usuario no encontrado.', 404);

            await userRepository.updateById(user_id, { email: new_email, email_verified: true });

        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new ServerError('El enlace ha expirado. Por favor, realiza la solicitud de nuevo.', 401);
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw new ServerError('El enlace es inválido.', 401);
            } else {
                throw err;
            }
        }
    };

};


const authService = new AuthService();

export default authService;