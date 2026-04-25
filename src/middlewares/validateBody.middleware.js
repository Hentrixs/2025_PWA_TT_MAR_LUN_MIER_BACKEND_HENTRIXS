
const validateBody = (requiredFields) => (req,res,next) => {
    for (const field of requiredFields) {
        const value = req.body[field];
        if (value === undefined || value === null || String(value).trim() === '') {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: `El campo ${field} es obligatorio.`
            });
        };
    };
    next();
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // que es esto wtf.

export const validateEmail = (field = 'email') => (req,res,next) => {
    const value = req.body[field];
    if (value && !EMAIL_REGEX.test(value)) {
        return res.status(400).json({
            ok: false,
            status: 400,
            message: `El formato del campo ${field} no es un email valido`
        });
    };
    next();
};

export default validateBody;