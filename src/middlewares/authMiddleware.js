import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import ServerError from '../helpers/error.helper.js';

const authMiddleware = (req, res, next) => {
    try {

        const auth_header = req.headers.authorization;
        if (!auth_header) {
            throw new ServerError('Token invalido', 401);
        }
        const auth_token = auth_header.split(' ')[1];
        if (!auth_token) {
            throw new ServerError('Token invalido', 401);
        }

        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY);
        req.user = payload;
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