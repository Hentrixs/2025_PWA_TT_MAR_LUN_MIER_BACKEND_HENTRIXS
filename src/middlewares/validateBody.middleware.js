import { getRequestLanguage } from '../helpers/lang.helper.js';

const validateBody = (requiredFields) => (req,res,next) => {
    const lang = getRequestLanguage(req);
    for (const field of requiredFields) {
        const value = req.body[field];
        if (value === undefined || value === null || String(value).trim() === '') {
            const message = lang === 'en'
                ? `The field '${field}' is required.`
                : `El campo ${field} es obligatorio.`;
            return res.status(400).json({
                ok: false,
                status: 400,
                message
            });
        };
    };
    next();
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (field = 'email') => (req,res,next) => {
    const lang = getRequestLanguage(req);
    const value = req.body[field];
    if (value && !EMAIL_REGEX.test(value)) {
        const message = lang === 'en'
            ? `The format of the field '${field}' is not a valid email.`
            : `El formato del campo ${field} no es un email valido`;
        return res.status(400).json({
            ok: false,
            status: 400,
            message
        });
    };
    next();
};

export default validateBody;