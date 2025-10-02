/*********************************************
 * Objetivo:Controller responsavel pela regra de negocio da recuperação de senha
 * Data: 30/09/2025
 * Autor: Beatriz Rodrigues
 * Versão 1.0
 * ***********************************************/

//import do status_code
const message = require('../../modulo/config.js')

//import do DAO para realizar o CRUD no bd
const redefinirSenhaDAO = require('../../model/DAO/redefinirSenha.js')
const usuariosDAO = require('../../model/DAO/usuario.js')
const bcrypt = require('bcrypt')
const { enviaremail } = require('../../service/serviceEmail.js')

//solicitação de senha
const solicitarRedefinicao = async function(email, contentType){
    try {
        if(contentType !== 'application/json'){
           return message.ERROR_CONTENT_TYPE //415
        }
        
        if(!email || email === ''){
            return message.ERROR_REQUIRED_FIELDS
        }

        let resultUsuario = await usuariosDAO.selectByEmailUsuario(email)
        if(!resultUsuario){
            return message.ERROR_NOT_FOUND
        }
        
        //math.random() serve para deixar o tokn em ordem aleatoria
        //math.flor() impede que o token receba qualquer coisa que nao seja numero (-, ;, )
        let token = Math.floor(100000 + Math.random() * 90000).toString()
        let expiracao = new Date(Date.now() + 15 * 60 * 1000) // validade 15 minutos
        
        let resultToken = await redefinirSenhaDAO.insertRedefinicao(resultUsuario.id, token, usado)

        if(resultToken){
            await enviaremail (resultUsuario.email, 'Redefinição de senha', `Seu token para redefinição de senha é: ${token}. Ele é válido por 15 minutos.`)
            return message.SUCESS_CREATED_ITEM
        }else {
            return message.ERROR_INTERNAL_SERVER_MODEL//500
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//função valida o token
const validarToken = async function(token, contentType){
    try {
        if(contentType == 'application/json'){
            return message.ERROR_CONTENT_TYPE
        }

        if(!token || token === ''){
            return message.ERROR_REQUIRED_FIELDS
        }

        let resultToken = await usuariosDAO.updateStatusExpirado(token)
        if(!resultToken){
            return message.ERROR_INVALID_CODE
        }

        if(new Date(resultToken.expiracao) < new Date()){
            return message.ERROR_CODE_EXPIRED
        }

        return{ status: true, status_code: 200, message: 'Token validado com sucesso!' }
    
    } catch (error) {
        console.log("ERRO AO VALIDAR O CODIGO", error)
        return message.ERROR_CODE_EXPIRED
}
}

const redefinirSenha = async function(dados,  contentType){
    try {
        if(contentType !== 'application/json'){
            return message.ERROR_CONTENT_TYPE
        }

        if(!dados.token || !dados.novaSenha){
            return message.ERROR_REQUIRED_FIELDS
        }

        let registro = await redefinirSenhaDAO.selectByToken(dados.token)
        if(!registro){
            return message.ERROR_INVALID_CODE
        }

        if(new Date(registro.usado) < new Date()){
            return message.ERROR_CODE_EXPIRED
        }

        let senha = await bcrypt.hash(dados.novaSenha, 10)
        let resultUpdate = await redefinirSenhaDAO.senhaAtualizada(registro.id, senha)

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