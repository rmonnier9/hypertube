import nodemailer from 'nodemailer';

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
    if (error) { console.log(error); }
  });
};

export default mail;
