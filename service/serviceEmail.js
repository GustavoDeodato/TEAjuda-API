const nodemailer = require("nodemailer");

const enviarEmail = async (to, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Suporte -->" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Recuperação de Senha",
        text: `Seu token de recuperação é: ${token} (válido por 15 minutos).`
    });
};

module.exports = {
    enviarEmail
};