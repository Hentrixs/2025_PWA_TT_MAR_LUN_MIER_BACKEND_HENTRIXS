/**
 * Centralized helper for generating beautiful, brand-consistent HTML email templates for GreenSlack.
 * Supports multiple languages (es, en).
 */

const translations = {
    es: {
        footer_tagline: 'El cerebro colectivo de tu equipo.',
        footer_notice: 'Recibiste este correo porque estás registrado en GreenSlack. Si no reconoces esta actividad, por favor ignora este mail.',
        verification: {
            subject: 'verifica tu correo electrónico',
            welcome: '¡Bienvenido {{name}}!',
            p1: 'Gracias por unirte a <strong>GreenSlack</strong>. Tu cuenta ha sido creada con éxito.',
            p2: 'Para comenzar a colaborar con tu equipo, por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo:',
            btn: 'Verificar correo electrónico',
            hint: 'Si el botón no funciona, copia y pega este enlace en tu navegador:'
        },
        reset_password: {
            subject: 'Restablecer Contraseña',
            title: 'Restablecer tu contraseña',
            p1: 'Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en GreenSlack.',
            p2: 'Haz clic en el botón de abajo para confirmar el cambio y elegir una nueva contraseña:',
            btn: 'Confirmar restablecimiento',
            footer: 'Este enlace expirará en 24 horas por motivos de seguridad. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.'
        },
        email_change: {
            subject: 'Confirma tu nuevo correo electrónico',
            title: 'Confirma tu nuevo correo electrónico',
            p1: 'Has solicitado cambiar tu dirección de correo electrónico en GreenSlack.',
            p2: 'Por favor, haz clic en el botón de abajo para confirmar que esta dirección te pertenece:',
            btn: 'Confirmar nuevo email',
            footer: 'Si no solicitaste este cambio, puedes ignorar este correo.'
        },
        invitation: {
            subject: 'has recibido una invitación a GreenSlack',
            title: 'Invitación a un espacio de trabajo',
            hello: 'Hola <strong>{{name}}</strong>,',
            p1: 'Te han invitado a colaborar en un espacio de trabajo en <strong>GreenSlack</strong>.',
            p2: '¿Qué te gustaría hacer con tu invitación?',
            btn_accept: 'Aceptar invitación',
            btn_reject: 'Rechazar',
            footer: '¡Esperamos verte pronto en el equipo!'
        }
    },
    en: {
        footer_tagline: 'The collective brain of your team.',
        footer_notice: 'You received this email because you are registered with GreenSlack. If you do not recognize this activity, please ignore this email.',
        verification: {
            subject: 'verify your email address',
            welcome: 'Welcome {{name}}!',
            p1: 'Thank you for joining <strong>GreenSlack</strong>. Your account has been successfully created.',
            p2: 'To start collaborating with your team, please verify your email address by clicking the button below:',
            btn: 'Verify email address',
            hint: 'If the button does not work, copy and paste this link into your browser:'
        },
        reset_password: {
            subject: 'Reset Password',
            title: 'Reset your password',
            p1: 'We have received a request to reset the password for your GreenSlack account.',
            p2: 'Click the button below to confirm the change and choose a new password:',
            btn: 'Confirm reset',
            footer: 'This link will expire in 24 hours for security reasons. If you did not request this change, you can safely ignore this email.'
        },
        email_change: {
            subject: 'Confirm your new email address',
            title: 'Confirm your new email address',
            p1: 'You have requested to change your email address on GreenSlack.',
            p2: 'Please click the button below to confirm that this address belongs to you:',
            btn: 'Confirm new email',
            footer: 'If you did not request this change, you can ignore this email.'
        },
        invitation: {
            subject: 'you have received an invitation to GreenSlack',
            title: 'Invitation to a workspace',
            hello: 'Hello <strong>{{name}}</strong>,',
            p1: 'You have been invited to collaborate in a workspace on <strong>GreenSlack</strong>.',
            p2: 'What would you like to do with your invitation?',
            btn_accept: 'Accept invitation',
            btn_reject: 'Reject',
            footer: 'We hope to see you soon on the team!'
        }
    }
};

const getBaseTemplate = (lang, title, content) => {
    const t = translations[lang] || translations.es;
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; color: #1c1e21; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e1e4e8;">
        <!-- Header -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #161A1D; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="vertical-align: middle;">
                                <!-- Refined CSS Leaf Logo -->
                                <div style="width: 30px; height: 30px; background-color: #22C55E; border-radius: 2px 20px 2px 20px;"></div>
                            </td>
                            <td style="padding-left: 12px; vertical-align: middle;">
                                <span style="font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -1.5px; line-height: 1;">
                                    <span style="color: #0BA561;">Green</span><span style="color: #ffffff;">Slack</span>
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <!-- Content -->
        <div style="padding: 40px; line-height: 1.6;">
            <h1 style="font-size: 24px; margin-top: 0; color: #161A1D; font-weight: 700;">${title}</h1>
            <div style="font-size: 16px; color: #4f5660;">
                ${content}
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e1e4e8;">
            <p style="font-size: 12px; color: #6a737d; margin: 0;">
                &copy; 2026 GreenSlack. ${t.footer_tagline}
            </p>
            <p style="font-size: 11px; color: #9da5b1; margin-top: 10px;">
                ${t.footer_notice}
            </p>
        </div>
    </div>
</body>
</html>
`;
};

export const getEmailSubject = (lang, templateName, data = {}) => {
    const t = translations[lang] || translations.es;
    let subject = t[templateName].subject;
    if (data.name) {
        if (lang === 'es') subject = `Bienvenido ${data.name}, ${subject}`;
        else subject = `Welcome ${data.name}, ${subject}`;
    }
    return subject;
};

export const getVerificationEmailTemplate = (name, link, lang = 'es') => {
    const t = (translations[lang] || translations.es).verification;
    return getBaseTemplate(
        lang,
        t.welcome.replace('{{name}}', name),
        `
        <p>${t.p1}</p>
        <p>${t.p2}</p>
        <div style="text-align: center; margin: 35px 0;">
            <a href="${link}" style="display: inline-block; padding: 14px 32px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.btn}</a>
        </div>
        <p style="font-size: 14px; color: #6a737d;">${t.hint}</p>
        <p style="font-size: 13px; color: #0BA561; word-break: break-all;">${link}</p>
        `
    );
};

export const getResetPasswordEmailTemplate = (link, lang = 'es') => {
    const t = (translations[lang] || translations.es).reset_password;
    return getBaseTemplate(
        lang,
        t.title,
        `
        <p>${t.p1}</p>
        <p>${t.p2}</p>
        <div style="text-align: center; margin: 35px 0;">
            <a href="${link}" style="display: inline-block; padding: 14px 32px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.btn}</a>
        </div>
        <p style="font-size: 14px; color: #6a737d;">${t.footer}</p>
        `
    );
};

export const getEmailChangeEmailTemplate = (link, lang = 'es') => {
    const t = (translations[lang] || translations.es).email_change;
    return getBaseTemplate(
        lang,
        t.title,
        `
        <p>${t.p1}</p>
        <p>${t.p2}</p>
        <div style="text-align: center; margin: 35px 0;">
            <a href="${link}" style="display: inline-block; padding: 14px 32px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.btn}</a>
        </div>
        <p style="font-size: 14px; color: #6a737d;">${t.footer}</p>
        `
    );
};

export const getInvitationEmailTemplate = (name, accept_link, reject_link, lang = 'es') => {
    const t = (translations[lang] || translations.es).invitation;
    return getBaseTemplate(
        lang,
        t.title,
        `
        <p>${t.hello.replace('{{name}}', name)}</p>
        <p>${t.p1}</p>
        <p>${t.p2}</p>
        <div style="text-align: center; margin: 35px 0;">
            <a href="${accept_link}" style="display: inline-block; padding: 12px 28px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin-right: 10px;">${t.btn_accept}</a>
            <a href="${reject_link}" style="display: inline-block; padding: 12px 28px; background-color: #f1f3f5; color: #4f5660; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; border: 1px solid #d1d5da;">${t.btn_reject}</a>
        </div>
        <p style="font-size: 14px; color: #6a737d;">${t.footer}</p>
        `
    );
};

