//eslint-disable-next-line
const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_EMAIL_PWD,
    },
});

module.exports = emailTransporter;