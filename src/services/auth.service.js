import jwt from 'jsonwebtoken';
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/mailer.config.js";
import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from 'bcrypt';


class AuthService {
    async register({ name, email, password }) {
        if (!name || !email || !password) {
            throw new ServerError('El nombre, email y passowrd son obligatorios', 404);
            // porque aca segun tu es 400 y no 404 o 401
        };

        const userByEmail = await userRepository.getByEmail(email);
        if (userByEmail) {
            throw new ServerError('Email del usuario ya existente', 400);
        };

        const userByName = await userRepository.getByUsername(name);
        if (userByName) {
            throw new ServerError('Nombre de usuario ya existente', 400);
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
            <h1>Verifica tu correo electronico</h1>
            <p>te has registrado correctamente, necesitamos verificar tu correo electronico.</p>
            <a href="${ENVIRONMENT.URL_FRONTEND}verify-email?verify_email_token=${verifyEmailToken}">Click aqui para verificar tu correo</a>
            <br>
            <span>Si no reconoces este registro desestima este mail.</span>
            `
        })
    };

    async verifyEmail({ verify_email_token }) {
        if (!verify_email_token) {
            throw new ServerError('No se encuentra token de verificacion', 400);
        };
        try {
            // Esto checkea el token usando la misma clave pero desencriptada no?
            const { email, name } = jwt.verify(verify_email_token, ENVIRONMENT.JWT_SECRET_KEY);
            const user = await userRepository.getByEmail(email);
            if (!user) {
                throw new ServerError('El usuario ya no existe', 404);
            } else if (user.email_verified) {
                throw new ServerError('Usuario con email ya validado', 400);
            } else {
                const user_updated = await userRepository.updateById(user._id, { email_verified: true });

                if (!user_updated.email_verified) {
                    throw new ServerError('El usuario no se pudo actualizar en la base de datos', 500);
                } else {
                    return user_updated // que pasa aca? y esto se retornaba?
                }

            };
        } catch (err) { //que es eso de jwt.TokenExpiredError
            if (err instanceof jwt.TokenExpiredError) {
                const { email, name } = jwt.decode(verify_email_token); // Esto saca el payload del token.
                await this.sendVerifyEmail({ email, name });
                throw new ServerError('El token de verificación expiró. Te hemos enviado un correo nuevo.', 401)
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Token invalido o corrupto', 401);
            } else {
                throw err;
            };
        };
    };

    async login({ email, password }) {
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Usuario no encontrado', 404);
        }
        const is_same_password = await bcrypt.compare(password, user.password); // menos mal que me avisaste porque se me olvido esto


        if (!is_same_password) {
            throw new ServerError('Contraseña incorrecta', 401);
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
            throw new ServerError('No existe un usuario con ese email', 404);
        };

        const auth_token = jwt.sign({ email: email }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: "1d" });

        if (!auth_token) {
            throw new ServerError('Error al general el JWT', 500)
        };

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
            throw new ServerError('Falta el token o la nueva contraseña', 400);
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
                throw new ServerError('Token exipirado, vuelve a solicitarlo', 401); // esto veamoslo al final, pero no era que habia un mecanismo en verifyemail para reenviar el token o algo asi?
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Link de reconocimiento es invalido o esta corrupto', 401);
            } else {
                throw err;
            }
        };

    };
};

const authService = new AuthService();

export default authService;