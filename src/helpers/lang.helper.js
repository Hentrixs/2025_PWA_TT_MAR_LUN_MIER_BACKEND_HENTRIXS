export const getRequestLanguage = (req) => {
    const lang = req.headers['x-lang'] || req.headers['accept-language'] || 'es';
    return lang.startsWith('en') ? 'en' : 'es';
};
