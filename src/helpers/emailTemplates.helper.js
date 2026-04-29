/**
 * Centralized helper for generating beautiful, brand-consistent HTML email templates for GreenSlack.
 */

const getBaseTemplate = (title, content) => `
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
                &copy; 2026 GreenSlack. El cerebro colectivo de tu equipo.
            </p>
            <p style="font-size: 11px; color: #9da5b1; margin-top: 10px;">
                Recibiste este correo porque estás registrado en GreenSlack. Si no reconoces esta actividad, por favor ignora este mail.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const getVerificationEmailTemplate = (name, link) => getBaseTemplate(
    `¡Bienvenido ${name}!`,
    `
    <p>Gracias por unirte a <strong>GreenSlack</strong>. Tu cuenta ha sido creada con éxito.</p>
    <p>Para comenzar a colaborar con tu equipo, por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
    <div style="text-align: center; margin: 35px 0;">
        <a href="${link}" style="display: inline-block; padding: 14px 32px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Verificar correo electrónico</a>
    </div>
    <p style="font-size: 14px; color: #6a737d;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
    <p style="font-size: 13px; color: #0BA561; word-break: break-all;">${link}</p>
    `
);

export const getResetPasswordEmailTemplate = (link) => getBaseTemplate(
    'Restablecer tu contraseña',
    `
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en GreenSlack.</p>
    <p>Haz clic en el botón de abajo para confirmar el cambio y elegir una nueva contraseña:</p>
    <div style="text-align: center; margin: 35px 0;">
        <a href="${link}" style="display: inline-block; padding: 14px 32px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Confirmar restablecimiento</a>
    </div>
    <p style="font-size: 14px; color: #6a737d;">Este enlace expirará en 24 horas por motivos de seguridad. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
    `
);

export const getEmailChangeEmailTemplate = (link) => getBaseTemplate(
    'Confirma tu nuevo correo electrónico',
    `
    <p>Has solicitado cambiar tu dirección de correo electrónico en GreenSlack.</p>
    <p>Por favor, haz clic en el botón de abajo para confirmar que esta dirección te pertenece:</p>
    <div style="text-align: center; margin: 35px 0;">
        <a href="${link}" style="display: inline-block; padding: 14px 32px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Confirmar nuevo email</a>
    </div>
    <p style="font-size: 14px; color: #6a737d;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
    `
);

export const getInvitationEmailTemplate = (name, accept_link, reject_link) => getBaseTemplate(
    'Invitación a un espacio de trabajo',
    `
    <p>Hola <strong>${name}</strong>,</p>
    <p>Te han invitado a colaborar en un espacio de trabajo en <strong>GreenSlack</strong>.</p>
    <p>¿Qué te gustaría hacer con tu invitación?</p>
    <div style="text-align: center; margin: 35px 0;">
        <a href="${accept_link}" style="display: inline-block; padding: 12px 28px; background-color: #0BA561; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin-right: 10px;">Aceptar invitación</a>
        <a href="${reject_link}" style="display: inline-block; padding: 12px 28px; background-color: #f1f3f5; color: #4f5660; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; border: 1px solid #d1d5da;">Rechazar</a>
    </div>
    <p style="font-size: 14px; color: #6a737d;">¡Esperamos verte pronto en el equipo!</p>
    `
);
