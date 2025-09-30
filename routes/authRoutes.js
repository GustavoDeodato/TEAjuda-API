// // routes/authRoutes.js

const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/verificarToken.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sendEmail = require('../utils/sendemail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const bodyParserJSON = bodyParser.json()
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

// Rota para solicitar redefinição de senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = await jwt.sign({ resetToken }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: tokenHash,
                resetPasswordExpires: new Date(Date.now() + 3600000) // Expira em 1 hora
            }
        });

        const resetUrl = `http://localhost:3000/reset-password/${tokenHash}`;
        const emailHtml = `
            <h2>Redefinição de Senha</h2>
            <p>Clique no link para redefinir sua senha:</p>
            <a href="${resetUrl}">Redefinir Senha</a>
            <p>O link expirará em 1 hora.</p>
        `;

        await sendEmail(user.email, 'Redefinição de Senha', emailHtml);

        res.status(200).json({ message: 'Link de redefinição enviado para o seu e-mail.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar a solicitação.' });
    }
});

// Rota para redefinir a senha
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token de redefinição inválido ou expirado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        res.status(200).json({ message: 'Senha redefinida com sucesso.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao redefinir a senha.' });
    }
});

module.exports = router;

