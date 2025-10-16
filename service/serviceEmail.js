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
        from: `"Suporte TEAjuda" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Recuperação de Senha",
        text: `Olá! Seu token de recuperação é: ${token}\n\nEle é válido por 15 minutos.`,
    });
};


module.exports = { enviarEmail };
