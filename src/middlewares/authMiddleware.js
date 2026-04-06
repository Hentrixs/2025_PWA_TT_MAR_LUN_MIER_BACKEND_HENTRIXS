import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import ServerError from '../helpers/error.helper.js';

const authMiddleware = (req, res, next) => {
    try {

        const auth_header = req.headers.authorization; // el token se envia en headers de authorization normalmente.
        if (!auth_header) {
            throw new ServerError('Token invalido', 401);
        }
        const auth_token = auth_header.split(' ')[1]; // esto saca el Bearer y nos devuelve en token puro
        if (!auth_token) {
            throw new ServerError('Token invalido', 401);
        }

        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY); // se verifica y extrae el payload

        // req es un obj y le podes agregar o cambiar cosas 
        req.user = payload;

        // claro, a mi no me interesa la informacion del request, 
        // pero se la tenemos que pasar a los controladores que si le importan

        next();
    } catch (err) {
        if (err instanceof ServerError) {
            res.status(err.status).json({
                ok: false,
                status: err.status,
                message: err.message
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                ok: false,
                status: 401,
                message: 'Token invalido'
            })
        } else {
            res.status(500).json({
                ok: false,
                status: 500,
                message: 'Internal Server Error.'
            });
        };
    };
};

export default authMiddleware;