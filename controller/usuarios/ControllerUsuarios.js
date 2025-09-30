/*********************************************
 * Objetivo: Controller referente as ações de CRUD de usuarios
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ********************************************** */
const message = require('../../modulo/config.js')
const usuariosDAO = require('../../model/DAO/usuario.js')

const inserirUsuario = async function(usuario, contentType){
    try {
        if(String(contentType).toLowerCase() === 'application/json'){

            if(usuario.nome == ''|| usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100|| 
                usuario.senha == '' || usuario.senha == null || usuario.senha == undefined|| usuario.senha.length > 100 ||
                usuario.email == '' || usuario.email == null || usuario.email == undefined || usuario.email.length > 100 
        
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
    try {
        if (String(contentType).toLocaleLowerCase() === 'application/json') {
            console.log('Content-Type recebido:', contentType);

            if (!usuario.id || 
                usuario.nome == '' || usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100 ||
                usuario.email== '' || usuario.email == null|| usuario.email == undefined|| usuario.email.length > 100  ||
                usuario.senha=='' || usuario.senha == null || usuario.senha == undefined ||usuario.senha.length > 100
                // !usuario.data_expiracao || 
                // usuario.expirado !== true && usuario.expirado !== false 
                
            ) {
                return message.ERROR_REQUIRED_FIELDS//status code 400
            } else {
                //verifica se o ID existe no BD
                let result = await usuariosDAO.selectByIdUsuario(usuario.id)
              if(!result){
                    return message.ERROR_NOT_FOUND; //404
                }

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
        if(id == '' || id == null || id == undefined || isNaN(id)){
                  return message.ERROR_REQUIRED_FIELDS//400
        }else{
           
          let resultAlbum = await usuariosDAO.selectByIdUsuario(id)

          if(resultAlbum != false || typeof(resultAlbum) == 'object'){
              if(resultAlbum.length > 0){
                  //delete

                  result = await usuariosDAO.deleteUsuario(id)

                  if(result)
                      return message.SUCESS_DELETE_ITEM//200
                  else 
                  return message.ERROR_INTERNAL_SERVER_MODEL//500
              }else{
                  return message.ERROR_NOT_FOUND//404
              }

          }else{
              return message.ERROR_INTERNAL_SERVER_CONTROLLER//500
          }
        }



  } catch (error) {
      return message.ERROR_INTERNAL_SERVER_CONTROLLER//500
  }
}




module.exports = {
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    buscarUsuario,
    listarUsuario
}