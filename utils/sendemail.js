const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service: process.env.EMAIL_SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.EMAIL_SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: html,
        });

        console.log("E-mail enviado com sucesso");
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
};

module.exports = sendEmail;
