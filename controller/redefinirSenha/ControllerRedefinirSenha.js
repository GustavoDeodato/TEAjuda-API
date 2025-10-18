/*********************************************
 * Objetivo:Controller responsavel pela regra de negocio da recuperação de senha
 * Data: 10/10/2025
 * Autor: Gustavo Deodato
 * Versão 2.0
 * ***********************************************/

const message = require('../../modulo/config.js')

const redefinirSenhaDAO = require('../../model/DAO/redefinirSenha.js')
const usuariosDAO = require('../../model/DAO/usuario.js')
const bcrypt = require('bcrypt')
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
    console.log(contentType)
    try {
        if(contentType !== 'application/json'){
            return message.ERROR_CONTENT_TYPE
        }

        if(!dados.token || !dados.novaSenha){
            return message.ERROR_REQUIRED_FIELDS
        }

        let registro = await redefinirSenhaDAO.selectByToken(dados.token)
        console.log(registro)
        if(!registro){
            return message.ERROR_INVALID_CODE
        }

        let senha = await bcrypt.hash(dados.novaSenha, 10)
        let resultUpdate = await redefinirSenhaDAO.updateSenha(registro.id, senha)
        console.log(resultUpdate)

        if(resultUpdate){
            await redefinirSenhaDAO.updateStatusUsado(registro.id)
            return message.SUCESS_CREATED_ITEM
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    solicitarRedefinicao,
    validarToken,
    redefinirSenha
}