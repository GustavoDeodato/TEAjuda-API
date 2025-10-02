// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();

// auth.controller.js

const db = require('./db'); // Importa a conexão do MySQL
const sendEmail = require('./emailService'); // Mantemos a mesma função de e-mail
const crypto = require('crypto');

// Rota POST: /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        // 1. Procura o usuário pelo email
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            // SEGURANÇA: Retorna uma mensagem genérica
            return res.status(200).json({
                success: true,
                data: 'Se o e-mail estiver registrado, enviamos instruções para redefinição.'
            });
        }

        // 2. Gera o Token Secreto
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = Date.now() + 3600000; // Expira em 1 hora (em milissegundos)

        // 3. Salva o Token e a Expiração no Banco
        await db.execute(
            'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?',
            [resetToken, resetExpires, email]
        );

        // 4. Monta e Envia o Email
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`; // Ajuste sua URL FRONTEND
        
        const message = `
            <h1>Recuperação de Senha</h1>
            <p>Clique neste link para redefinir sua senha:</p>
            <a href="${resetURL}" target="_blank">${resetURL}</a>
            <p>Este link expira em 1 hora.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Recuperação de Senha do Site',
            message
        });

        res.status(200).json({
            success: true,
            data: 'E-mail de recuperação enviado!'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
};








// const sendEmail = async (email, subject, html) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             service: process.env.EMAIL_SERVICE,
//             port: Number(process.env.EMAIL_PORT),
//             secure: Boolean(process.env.EMAIL_SECURE),
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: subject,
//             html: html,
//         });

//         console.log("E-mail enviado com sucesso");
//     } catch (error) {
//         console.error("Erro ao enviar e-mail:", error);
//     }
// };

// module.exports = sendEmail;
