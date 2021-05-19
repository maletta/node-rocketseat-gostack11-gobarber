export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '420aacabad8ef3',
    pass: '6c9238962c7bb5',
  },
  secure: false, // se vai ser ssl ou não, se vai ser seguro
  default: {
    from: 'Mauricio Maletta <noreply@gobarber.com>',
  },
};

/**
 * serviçoes de email
 * amazon SES
 * Mailgun
 * Sparkpost
 * Mandril (Mailchimp)
 * Gmail (mas o smtp dele tem um limite e bloqueia spam)
 *
 *
 * serviçoes de email para desenvolvimeto, mas não funciona em prod
 * Mailtrap
 */
