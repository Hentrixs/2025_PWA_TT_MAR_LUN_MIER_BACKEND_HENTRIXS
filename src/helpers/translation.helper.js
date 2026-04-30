import { TRANSLATIONS } from "../constants/translations.js";

export const translate = (message, lang = 'es') => {
    if (TRANSLATIONS[message]) {
        return TRANSLATIONS[message][lang] || TRANSLATIONS[message].es;
    }
    return message;
};
