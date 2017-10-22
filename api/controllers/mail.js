const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

const mail = (to, subject, text) => {
  const mailOptions = {
    from: '"Api Hypertube" <api.hypertube@42.fr>',
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {}
  });
};

exports.sendWelcomeMail = (email) => {
  const subject = 'Hypertube - Account created !';
  const content = 'Welcome to Hypertube !';
  mail(email, subject, content);
};

exports.sendResetPasswordEmail = (user) => {
  let subject;
  let content;
  switch (user.profile.lang) {
    case 'fr-fr':
      subject = 'Votre mot de passe Hypertube a été changé.';
      content = `Bonjour,\n\nNous vous confirmons que le mot de passe de votre compte ${user.email} a été changé.\n\nL'équipe Hypertube`;
      break;

    default:
      subject = 'Your Hypertube password has been changed';
      content = `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n\nHypertube team`;
  }

  mail(user.email, subject, content);
};

exports.sendForgotPasswordEmail = (user, header) => {
  const token = user.passwordResetToken;
  let subject;
  let content;
  switch (user.profile.lang) {
    case 'fr-fr':
      subject = 'Nouveau mot de passe Hypertube';
      content = `Bonjour,\n\nCliquez sur le lien suivant, ou copiez-le dans votre navigateur, pour changer de mot de passe : http://${header}/reset/${token}\n\nL'équipe Hypertube`;
      break;

    default:
      subject = 'Reset your Hypertube password';
      content = `Hello,\n\nPlease click on the following link, or paste this into your browser, to choose a new password: http://${header}/reset/${token}\n\nHypertube team`;
  }
  mail(user.email, subject, content);
};
