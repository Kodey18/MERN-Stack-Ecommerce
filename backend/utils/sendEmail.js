const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        logger: true,
        debug: false,
        secureConnection: false,
        auth : {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnAuthorized: true,
        },
    });

    const mailOptions = {
        from : process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;