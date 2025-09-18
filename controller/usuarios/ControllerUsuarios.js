/*********************************************
 * Objetivo: Controller referente as ações de CRUD de usuarios
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ********************************************** */
const message = require('../../modulo/config.js')

const usuariosDAO = require('../../model/DAO/usuario.js')

const inserirUsuario = async function(contentType, usuario){
    try {
        if(String(contentType).toLowerCase == 'aplication/json'){
            if(usuario.nome == ''|| usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100
                || usuario.senha == '' || usuario.senha == null || usuario.senha == undefined|| usuario.senha.length > 100 ||
                usuario.email == '' || usuario.email == null || usuario.email == undefined || usuario.email.length > 100 ||
                usuario.nome_tutelado == '' || usuario.nome_tutelado == undefined || usuario.nome_tutelado == null || usuario.nome_tutelado.length > 100
            ){
                return message.ERROR_REQUIRED_FIELDS//400
            }else{
                let resultusuario = await usuariosDAO.insertUsuario(usuario)
                console.log(resultusuario)

                if(resultusuario)
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

const atualizarUsuario = async function(contentType, usuario, id){
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            if (usuario.nome == '' || usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100 ||
                usuario.email == ''|| usuario.email == null|| usuario.email == undefined|| usuario.email.length > 8  ||
                id            == ''|| id == undefined      || id == null                || isNaN(id)
            ) {
                return message.ERROR_REQUIRED_FIELDS//status code 400
            } else {
                //verifica se o ID existe no BD
                let result = await usuariosDAO.selectByIdUsuarios(id)

                if (result != false || typeof (result) == 'object') {
                    if (result.length > 0) {
                        //Update
                        //Adiciona o atributo do ID no JSON com os dados recebidos no corpo da requisição
                        usuario.id = id
                        let resultUsuario = await usuariosDAO.selectByIdUsuarios(id)
                        if (resultUsuario) {
                            return message.SUCESS_CREATED_ITEM
                        } else {
                            return message.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    } else {
                        return message.ERROR_NOT_FOUND
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        
    }
}

const listarUsuario = async function(){
    try {
        let dadosUsuarios = {}

        let resultUsuarios = await usuariosDAO.selectAllUsuarios()

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
        if(id == null || id == undefined || id == '' || isNaN(id)){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{
            dadosusuario = {}

            let resultusuario = usuariosDAO.selectByIdUsuarios(id)
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
        
    }
}

const excluirUsuario = async function(id){
    try {
        if(id == null || id == undefined || id == '' || isNaN(id)){
            return message.ERROR_REQUIRED_FIELDS
        }else{
            let resultusuario = await usuariosDAO.selectByIdUsuarios(id)
            if(resultusuario != false || typeof(resultusuario) == 'object'){
                if(resultusuario.length > 0){

                    result = await usuariosDAO.deleteUsuarios(id)

                    if(result)
                        return message.SUCESS_DELETE_ITEM
                    else 
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }else{
                    return message.ERROR_NOT_FOUND
                }
                

            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
        
    }
}

module.exports = {
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    buscarUsuario,
    listarUsuario
}