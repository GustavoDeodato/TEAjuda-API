/*********************************************
 * Objetivo: Controller referente as ações de CRUD de usuarios
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ********************************************** */
const message = require('../../modulo/config.js')
const usuariosDAO = require('../../model/DAO/usuario.js')
const { enviarEmail } = require('../../service/serviceEmail.js')

const inserirUsuario = async function(usuario, contentType){
    try {
        if(String(contentType).toLowerCase() === 'application/json'){

            if(usuario.nome == ''|| usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100|| 
                usuario.senha == '' || usuario.senha == null || usuario.senha == undefined|| usuario.senha.length > 100 ||
                usuario.email == '' || usuario.email == null || usuario.email == undefined || usuario.email.length > 100 
                // usuario.token == '' || usuario.token == null || usuario.token == undefined || usuario.token.length > 100 ||
                // usuario.data_expiracao == '' || usuario.data_expiracao == null || usuario.data_expiracao == undefined || usuario.data_expiracao.length > 100 ||
                // usuario.expirado !== true && usuario.expirado !== false
            ){
                return message.ERROR_REQUIRED_FIELDS//400
            }else{
                let resultUsuario = await usuariosDAO.insertUsuario(usuario)

                if(resultUsuario)
                    return message.SUCESS_CREATED_ITEM//201
                else return message.ERROR_INTERNAL_SERVER_MODEL//500
                
            }
        }else{
            return message.ERROR_CONTENT_TYPE//415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
}

const atualizarUsuario = async function(usuario, id, contentType){
    console.log(id)
    try {
        if (String(contentType).toLocaleLowerCase() === 'application/json') {
            console.log('Content-Type recebido:', contentType);

            if (!usuario.id || 
                usuario.nome == '' || usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100 ||
                usuario.email== ''|| usuario.email == null|| usuario.email == undefined|| usuario.email.length > 100  ||
                usuario.token == '' || usuario.token == null || usuario.token == undefined || usuario.token.length > 6 ||
                !usuario.data_expiracao || 
                usuario.expirado !== true && usuario.expirado !== false 
                
            ) {
                return message.ERROR_REQUIRED_FIELDS//status code 400
            } else {
                //verifica se o ID existe no BD
                let result = await usuariosDAO.selectByIdUsuario(usuario.id)
                console.log(result)
              if(!result){
                    return message.ERROR_NOT_FOUND; //404
                }

                console.log(usuario)
                let resultUsuario = await usuariosDAO.updateUsuario(usuario)

                if (resultUsuario) 
                    return message.SUCESS_UPDATE_ITEM //200
                else 
                    return message.ERROR_INTERNAL_SERVER_MODEL //500    
              
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log('Erro no atualizarUsuario:', error);
        return message.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}

const listarUsuario = async function(){
    try {
        let dadosUsuarios = {}

        let resultUsuarios = await usuariosDAO.selectAllUsuario()

        if(resultUsuarios != false || typeof(resultUsuarios) == 'object'){
            if(resultUsuarios.length > 0){

                dadosUsuarios.status = true
                dadosUsuarios.status_code = 200,
                dadosUsuarios.items = resultUsuarios.length
                dadosUsuarios.users =  resultUsuarios

                return dadosUsuarios
            }else{
                return message.ERROR_NOT_FOUND
            }
        }
        return message.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuario = async function(id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id)){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{
            dadosusuario = {}

            let resultusuario =  await usuariosDAO.selectByIdUsuario(id)
            if(resultusuario != false || typeof(resultusuario) == 'object'){
                if(resultusuario.length > 0 ){
                //criacao do json para o array das usuarios 
                dadosusuario.status = true,
                dadosusuario.status_code = 200, 
                dadosusuario.usuarios = resultusuario
                return dadosusuario
                }else{
                   return message.ERROR_NOT_FOUND//404
                }                           
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL//500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUsuario = async function(id){
    try {
       if(contentType !== 'application/json'){
        return message.ERROR_CONTENT_TYPE //415
       }       
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
        
    }
}

//funcao para solicitar o token
const solicitarToken = async function(id, contentType){
    try {
        if(contentType == 'application/json'){
           return message.ERROR_CONTENT_TYPE 
        }
        
        if(!usuario.email || usuario.email === ''){
            return message.ERROR_REQUIRED_FIELDS
        }

        let resultUsuario = await usuariosDAO.selectByIdUsuario(id)
        if(!resultUsuario){
            return message.ERROR_NOT_FOUND
        }
        
        let token = Math.floor(1000 + Math.random() * 9000).toString();
        let expiracao = new Date(Date.now() + 15 * 60 * 1000) // validade 15 minutos
        
        let resultToken = await usuariosDAO.InsertSenha(id, token, expiracao)

        if(resultToken){
            await  enviarEmail(resultUsuario.email, 'Redefinição de senha', `Seu token para redefinição de senha é: ${token}. Ele é válido por 15 minutos.`)
            return message.SUCESS_CREATED_ITEM
        }else {
            return message.ERROR_INTERNAL_SERVER_MODEL//415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
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
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const redefinirSenha = async function(dados,  contentType){
    try {
        if(contentType == 'application/json'){
            return message.ERROR_CONTENT_TYPE
        }

        if(!dados.email || dados.email === ''){
            return message.ERROR_REQUIRED_FIELDS
        }

        let resultUsuario = await usuariosDAO.selectByToken(dados.token)
        if(!resultUsuario){
            return message.ERROR_CODE_EXPIRED
        }
   
        let senhaHash = await bcrypt.hash(dados.senha, 10)
        let resultUpdateSenha = await usuariosDAO.updateUsuario({
            id: resultUsuario.id,
            senha: senhaHash
        })

        if(resultUpdateSenha){
            await  usuariosDAO.updateStatusExpirado(resultUsuario.id)
            return message.SUCCESS_PASSWORD_RESET
        }else {
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log("ERRO NO REDEFINIR SENHA --> ", error )
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



module.exports = {
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    buscarUsuario,
    listarUsuario,
    solicitarToken,
    validarToken,
    redefinirSenha
}