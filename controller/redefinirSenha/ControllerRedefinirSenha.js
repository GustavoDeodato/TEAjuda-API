/*********************************************
 * Objetivo:Controller responsavel pela regra de negocio da recuperação de senha
 * Data: 10/10/2025
 * Autor: Gustavo Deodato
 * Versão 2.0
 * ***********************************************/

const message = require('../../modulo/config.js')

const redefinirSenhaDAO = require('../../model/DAO/redefinirSenha.js')
const usuariosDAO = require('../../model/DAO/usuario.js')
const bcrypt = require('bcryptjs')
const { enviarEmail } = require('../../service/serviceEmail.js')

//solicitação de senha
const solicitarRedefinicao = async function (email, contentType) {
    try {
        if (contentType !== 'application/json') {
            return message.ERROR_CONTENT_TYPE // 415
        }
        email = email.email

        if (!email || email === '') {
            return message.ERROR_REQUIRED_FIELDS // 400
        }

        let resultUsuario = await usuariosDAO.SelectLoginUsuario(email)
        console.log(resultUsuario)
        if (!resultUsuario) {
            return message.ERROR_NOT_FOUND // 404
        }

        // token aleatório de 5 dígitos
        let token = Math.floor(100000 + Math.random() * 90000).toString()

        // Define o token como não usado (0)
        let usado = 0

        let resultToken = await redefinirSenhaDAO.insertRedefinicao(token, usado, resultUsuario.email)
        console.log(resultToken)
        if (resultToken) {
            // Envia o e-mail com o token
            await enviarEmail(resultUsuario.email, token)
            console.log(enviarEmail)
            return message.SUCESS_CREATED_ITEM // 201
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


//função valida o token
const validarToken = async function (contentType, dados) {
    try {
        console.log(contentType)
        if (contentType !== 'application/json') {
            return message.ERROR_CONTENT_TYPE
        }

        let token = parseInt(dados?.token)

        if (isNaN(token) || token <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let resultToken = await redefinirSenhaDAO.selectByToken(token)

        if (!resultToken) {
            return message.ERROR_INVALID_CODE;
        }
        
        return message.SUCESS_VALID_TOKEN
        
    } catch (error) {
        console.log("ERRO AO VALIDAR O CODIGO", error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const redefinirSenha = async function(dados, contentType){
    console.log('=== REDEFINIR SENHA ===')
    console.log('Content-Type:', contentType)
    console.log('Dados recebidos:', dados)
    
    try {
        if(contentType !== 'application/json'){
            console.log('Erro: Content-Type inválido')
            return message.ERROR_CONTENT_TYPE
        }

        if(!dados.token || !dados.novaSenha){
            console.log('Erro: Token ou novaSenha ausentes')
            console.log('Token:', dados.token)
            console.log('NovaSenha:', dados.novaSenha ? '***' : 'undefined')
            return message.ERROR_REQUIRED_FIELDS
        }

        let registro = await redefinirSenhaDAO.selectByToken(dados.token)
        console.log('Registro encontrado:', registro)
        if(!registro){
            console.log('Erro: Token inválido ou expirado')
            return message.ERROR_INVALID_CODE
        }

        // Busca o usuário pelo email do registro
        let usuario = await usuariosDAO.SelectLoginUsuario(registro.email)
        console.log('Usuário encontrado:', usuario ? { id: usuario.id, email: usuario.email } : null)
        if(!usuario){
            console.log('Erro: Usuário não encontrado')
            return message.ERROR_NOT_FOUND
        }

        let senha = await bcrypt.hash(dados.novaSenha, 12)
        console.log('Hash gerado com sucesso')
        
        let resultUpdate = await redefinirSenhaDAO.updateSenha(usuario.id, senha)
        console.log('Resultado do update:', resultUpdate)

        if(resultUpdate){
            await redefinirSenhaDAO.updateStatusUsado(registro.id)
            console.log('Senha redefinida com sucesso!')
            return message.SUCCESS_PASSWORD_RESET
        }else{
            console.log('Erro: Falha ao atualizar senha no banco')
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.error('Erro ao redefinir senha:', error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    solicitarRedefinicao,
    validarToken,
    redefinirSenha
}