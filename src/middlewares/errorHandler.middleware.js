import ServerError from "../helpers/error.helper.js";
import { getRequestLanguage } from "../helpers/lang.helper.js";
import { TRANSLATIONS } from "../constants/translations.js";

const errorHandlerMiddleware = (err, req, res, next) => {

    const lang = getRequestLanguage(req);

    const translate = (message) => {
        if (TRANSLATIONS[message]) {
            return TRANSLATIONS[message][lang] || TRANSLATIONS[message].es;
        }
        return message;
    };

    if (err instanceof ServerError) {
        return res.status(err.status).json({
            ok: false,
            status: err.status,
            message: translate(err.message)
        });
    };

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            ok: false,
            status: 401,
            message: translate('TokenInvalido')
        });
    };

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            ok: false,
            status: 401,
            message: translate('El enlace ha expirado. Por favor, solicita uno nuevo.')
        });
    };

    res.status(500).json({
        ok: false,
        status: 500,
        message: translate('Ha ocurrido un error inesperado')
    });
};

export default errorHandlerMiddleware;