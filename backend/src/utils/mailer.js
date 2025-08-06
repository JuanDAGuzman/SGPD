const nodemailer = require('nodemailer');

async function sendTestMail(to, subject, text, html) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: '"SGPD Notificaciones" <no-reply@sgpd.com>',
    to,
    subject,
    text,
    html, 
  });
  return nodemailer.getTestMessageUrl(info);
}

module.exports = { sendTestMail };
