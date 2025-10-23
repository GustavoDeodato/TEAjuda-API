/*********************************************
 * Objetivo: Controller referente as ações de CRUD de usuarios
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ********************************************** */
const message = require('../../modulo/config.js')
const usuariosDAO = require('../../model/DAO/usuario.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const inserirUsuario = async function (contentType, usuario) {
    
    const saltRounds = 12
    if(String(contentType).toLowerCase() === 'application/json'){
        if(usuario.nome == ''|| usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100|| 
            usuario.senha == '' || usuario.senha == null || usuario.senha == undefined|| usuario.senha.length > 100 ||
            usuario.email == '' || usuario.email == null || usuario.email == undefined || usuario.email.length > 100 
    
        ){
            return message.ERROR_REQUIRED_FIELDS//400
    }else{
        try {
            // A função hash do bcrypt gera o salt internamente e então faz o hash da senha
            // com o número de rounds especificado (saltRounds).
            let senhaHash = await bcrypt.hash(usuario.senha, saltRounds)
            console.log(senhaHash)

            let arrayUsuario = {
                nome: usuario.nome,
                email: usuario.email,
                // senha original é substituída pelo hash
                senha: senhaHash 
            }
            console.log(arrayUsuario)


            let resultado = await usuariosDAO.insertUsuario(arrayUsuario)
            console.log(resultado)


            if (resultado) {
                return message.SUCESS_CREATED_ITEM
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
    
        } catch (error) {
            return message.ERROR_INTERNAL_SERVER_CONTROLLER
               
        }
    }

}
   
}

const atualizarUsuario = async function(usuario, id, contentType){
    try {
        if (String(contentType).toLocaleLowerCase() === 'application/json') {
            console.log('Content-Type recebido:', contentType)

            if (
                !id || isNaN(id) || id <= 0 || 
                usuario.nome == '' || usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100 ||
                usuario.email == '' || usuario.email == null || usuario.email == undefined || usuario.email.length > 100  ||
                usuario.senha == '' || usuario.senha == null || usuario.senha == undefined || usuario.senha.length > 100
         
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                //verifica se o ID existe no BD
                let result = await usuariosDAO.selectByIdUsuario(id)
                console.log(result)
                if(!result){
                    return message.ERROR_NOT_FOUND //404
                }

                let resultUsuario = await usuariosDAO.updateUsuario(usuario, id)

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

                console.log(dadosUsuarios)

                return dadosUsuarios
            }else{

                return message.ERROR_NOT_FOUND
            }
            
        }
        return message.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        console.log(error)
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


const LoginUsuario = async function (contentType, usuario){
    try {
        let { email, senha } = usuario

        if(!String(contentType).toLowerCase().includes('application/json')){
            return message.ERROR_CONTENT_TYPE
        }
        
        if (!email || !senha || String(email).length > 100 || String(senha).length > 255) {
            return message.ERROR_REQUIRED_FIELDS
        }

        let result = await usuariosDAO.SelectLoginUsuario(email)
        
        if (!result) {
            return message.ERROR_REQUIRED_FIELDS
        }
        
        let hashDoBanco = result.senha

        if (!hashDoBanco) {
            return message.ERROR_INTERNAL_SERVER_CONTROLLER
        }

        let senhaValida = await bcrypt.compare(senha, hashDoBanco)

        if (!senhaValida) {
            return message.ERROR_REQUIRED_FIELDS
        }
        
        const token = jwt.sign(
            {
                id: result.id, 
                email: result.email,
                nome: result.nome
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        
        return {
            status_code: 200,
            token: token,
            data: {
                id: result.id,
                nome: result.nome,
                email: result.email
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
    listarUsuario,
    LoginUsuario
}