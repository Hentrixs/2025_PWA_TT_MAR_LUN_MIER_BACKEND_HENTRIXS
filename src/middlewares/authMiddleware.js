import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import ServerError from '../helpers/error.helper.js';
import { translate } from '../helpers/translation.helper.js';
import { getRequestLanguage } from '../helpers/lang.helper.js';

const authMiddleware = (req, res, next) => {
    const lang = getRequestLanguage(req);
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
                message: translate(err.message, lang)
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                ok: false,
                status: 401,
                message: translate('Token invalido', lang)
            })
        } else {
            res.status(500).json({
                ok: false,
                status: 500,
                message: translate('Internal Server Error.', lang)
            });
        };
    };
};

export default authMiddleware;