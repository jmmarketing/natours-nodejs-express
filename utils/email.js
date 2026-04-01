const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1.) Create a transporter
  // Transporter is the service that will send the email (Gmail, SendGrid, Mailgun, Twilio, etc..). See well-known services documentation
  const transporter = nodemailer.createTransport({
    // service: 'Mailtrap',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // If Gmail will need to set up "less secure app" options - not good idea, better to use SendGrid, MailGun, etc.. for enterprise.
  });

  //2.) Define the email options
  const mailOptions = {
    from: '"JM Marketing" <jeff@jeffreymclean.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  //3.) Actually send the mail.
  // returns promise
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
