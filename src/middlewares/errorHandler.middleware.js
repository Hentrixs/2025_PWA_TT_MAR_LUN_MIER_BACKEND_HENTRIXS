import { error } from "console"
import ServerError from "../helpers/error.helper.js";
const errorHandlerMiddleware = (error, req, res, next) => {

    if (error instanceof ServerError) {
        return res.status(error.status).json({
            ok: false,
            status: error.status,
            message: error.message
        });
    };

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            ok: false,
            status: 401,
            message: 'TokenInvalido'
        });
    };

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            ok: false,
            status: error.status,
            message: error.message
        });
    };

    res.status(500).json({
        ok: false,
        status: 500,
        message: 'Ha ocurrido un error inesperado'
    });
};

export default errorHandlerMiddleware;