import jwt from 'jsonwebtoken';
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/mailer.config.js";
import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from 'bcrypt';
import userDTO from '../dto/user.dto.js';
import workspaceMemberRepository from '../repository/member.repository.js';



class AuthService {
    async register({ name, email, password }) {
        if (!name || !email || !password) {
            throw new ServerError('Todos los campos son obligatorios: nombre, email y contraseña.', 400);
            // porque aca segun tu es 400 y no 404 o 401
        };

        const userByEmail = await userRepository.getByEmail(email);
        if (userByEmail) {
            throw new ServerError('Este correo electrónico ya se encuentra registrado.', 400);
        };

        const userByName = await userRepository.getByUsername(name);
        if (userByName) {
            throw new ServerError('El nombre de usuario elegido ya está en uso.', 400);
        };

        const hashedPassword = await bcrypt.hash(password, 12); // encripacion del password. porque 12 es el recomendado? yo pensaba que era 10.
        await userRepository.create(name, email, hashedPassword); // es verdad, yo aca estaba por pasar el password sin hashear

        // aca va lo de enviar el mail de verificacion
        await this.sendVerifyEmail({ email, name }); // cuando llegue el momento explicame porque solo se pasan 2 parametros aca.
    };

    async sendVerifyEmail({ email, name }) {
        // crea y firma un token. como siempre, los datos no sensibles van en el payload y en los sensibles van en el signature.
        // pregunta, la ENVIRONMENT.JWT_SECRET_KEY no hace falta encriptarla para que no la decifren ?
        // aca lo que no entiendo es porque la parte del secret key no se descubre y las demas si.

        const verifyEmailToken = jwt.sign({ email: email, name: name }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: '5d' });
        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: `Bienvenido ${name}, verifica tu correo electronico`, // que era subject?
            html: `
            <h1>Verifica tu correo electrónico</h1>
            <p>Tu cuenta ha sido creada con éxito. Para comenzar a usar Slack Clone, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
            <a href="${ENVIRONMENT.URL_FRONTEND}verify-email?verify_email_token=${verifyEmailToken}">Click aqui para verificar tu correo</a>
            <br>
            <span>Si no reconoces este registro desestima este mail.</span>
            `
        })
    };

    async verifyEmail({ verify_email_token }) {
        if (!verify_email_token) {
            throw new ServerError('Token de verificación no encontrado.', 400);
        };
        try {
            // Esto checkea el token usando la misma clave pero desencriptada no?
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
                    return user_updated // que pasa aca? y esto se retornaba?
                }

            };
        } catch (err) { //que es eso de jwt.TokenExpiredError
            if (err instanceof jwt.TokenExpiredError) {
                const { email, name } = jwt.decode(verify_email_token); // Esto saca el payload del token.
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
        const is_same_password = await bcrypt.compare(password, user.password); // menos mal que me avisaste porque se me olvido esto


        if (!is_same_password) {
            throw new ServerError('Credenciales inválidas. Verifica tu correo y contraseña.', 401);
        }

        // NUNCA guardamos el password en el token! Y agregamos id, name y created_at
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

    async resetPasswordRequest({ email }) {
        if (!email) {
            throw new ServerError('No se envio email', 400)
        };

        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Si el correo existe, recibirás un enlace para restablecer tu contraseña.', 404);
        };

        const auth_token = jwt.sign({ email: email }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: "1d" });

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: 'Restablecer Password',
            html: `
            <h1>Bienvenido, por favor restablece tu password</h1>
            <a href="${ENVIRONMENT.URL_BACKEND}api/auth/reset-password/${auth_token}">Click aqui para restablecer</a>
            `,
        });
        return;
    };

    async resetPassword({ reset_token, new_password }) {
        if (!reset_token || !new_password) {
            throw new ServerError('Datos incompletos para el restablecimiento de contraseña.', 400);
        }
        try {
            // jwt.verify abre el token y se asegura de que haya sido firmado con TU LLAVE SECRETA, no con la nueva contraseña!
            const payload = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET_KEY);
            const user = await userRepository.getByEmail(payload.email);

            if (!user) {
                throw new ServerError('El usuario asociado a esta petición ya no existe', 404);
            };

            const hashedPassword = await bcrypt.hash(new_password, 12);
            await userRepository.updateById(user._id, { password: hashedPassword });

        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new ServerError('El enlace ha expirado. Por favor, solicita uno nuevo.', 401); // esto veamoslo al final, pero no era que habia un mecanismo en verifyemail para reenviar el token o algo asi?
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

        // Verificar contraseña antigua
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            throw new ServerError('La contraseña actual es incorrecta.', 401);
        }

        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(new_password, 12);

        await userRepository.updatePassword(user_id, hashedPassword);
    };

    async requestEmailChange({ user_id, password, new_email }) {
        if (!password || !new_email) {
            throw new ServerError('Faltan datos técnicos (contraseña o email).', 400);
        }

        const user = await userRepository.getById(user_id);
        if (!user) throw new ServerError('Usuario no encontrado.', 404);

        // Validar contraseña actual
        const is_same_password = await bcrypt.compare(password, user.password);
        if (!is_same_password) throw new ServerError('La contraseña actual es incorrecta.', 401);

        // Validar que el nuevo email no esté en uso
        const existingUser = await userRepository.getByEmail(new_email);
        if (existingUser) throw new ServerError('Este correo electrónico ya está registrado por otro usuario.', 400);

        // Generar token de cambio de email (expira en 1 hora por seguridad)
        const emailChangeToken = jwt.sign(
            { user_id, new_email },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Enviar mail
        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: new_email,
            subject: 'Confirma tu nuevo correo electrónico',
            html: `
            <h1>Cambio de correo electrónico</h1>
            <p>Has solicitado cambiar tu correo electrónico. Haz clic en el enlace de abajo para confirmar que esta dirección te pertenece:</p>
            <a href="${ENVIRONMENT.URL_BACKEND}api/auth/confirm-email-change/${emailChangeToken}">Confirmar cambio de email</a>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            `
        });
    };

    async confirmEmailChange({ token }) {
        if (!token) throw new ServerError('Token no proporcionado.', 400);

        try {
            const { user_id, new_email } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);

            const user = await userRepository.getById(user_id);
            if (!user) throw new ServerError('Usuario no encontrado.', 404);

            // Actualizar email
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