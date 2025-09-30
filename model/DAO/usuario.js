/*********************************************
 * Objetivo: criar o CRUD de dados da tabela usuarios no banco de dados 
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ********************************************** */

//import biblioteca prisma client para realizar as ações do db
const {PrismaClient} = require('@prisma/client')

//Instancia da classe do prisma client (cria um objeto)
const prisma = new PrismaClient


//Função para inserir novas usuarios
const insertUsuario = async function (usuario){
    try {
        const result = await prisma.$executeRawUnsafe(
            `CALL InserirUsuario('${usuario.nome}', '${usuario.email}', '${usuario.senha}')`
        );
        console.log(result)

     if(result)
         return true 
        else 
         return false 

    } catch (error) {
        console.log("Erro ao chamar producere", error)
        return false 
    }
}

//Função para atualizar uma usuario existente 
const updateUsuario = async function (usuario){
    try {
        let sql = `update tbl_usuario set 
                    nome = '${usuario.nome}',
                    email = '${usuario.email}',
                    senha = '${usuario.senha}',
                    token = '${usuario.token}',
                    data_expiracao = '${usuario.data_expiracao}',
                    expirado = ${usuario.expirado}
        where id = ${usuario.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true 
        else 
            return false 
        
    } catch (error) {
        return false 
    }
}


//função para deletar uma usuario 
const deleteUsuario = async function (id){
    try {
        let sql = `delete from tbl_usuario where id = ${id}`

        result = await prisma.$executeRawUnsafe(sql)
        if(result)
            return result
        else 
        return false 
    } catch (error) {
        return false 
    }

}

//função para mostrar todas as usuarios 
const selectAllUsuario = async function (){
    try {
        let result = await prisma.$queryRaw`SELECT * FROM vw_usuarios;`


        if(result)
            return result
        else
            return false
    } catch (error) {
        console.error("Erro ao buscar todos os usuarios", error)
        return false 
    }
}

//função para busca pelo ID 
const selectByIdUsuario = async function (id){
    try {

        let result = await prisma.$queryRaw`CALL search_usuario_id(${id});`

        if(result)
            return result
        else 
          return false

    } catch (error) {
        return false 
    }
    }


//Função para inserir um novo registro de redefinição de senha
const InsertSenha = async function (id, token, data_expiracao){
    try {
        let sql = `
        insert into tbl_redefinirsenha (id, token, data_expiracao)
        values (
            ${id}, 
            '${token}', 
            '${data_expiracao.toISOString().slice(0, 19).replace('T', ' ')}'
         );
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            let sql = `
             select * from tbl_redefinirsenha where id = ${id} order by criacao desc limit 1;
            `

            let criacaoRegistro = await prisma.$queryRawUnsafe(sql)
            return criacaoRegistro[0]
        }else{
            return false
        }
    } catch (error) {
        console.error("error ao redefinir senha ", error)
        return false
    }
}

//Função para selecioar por token
const selectByToken = async function(token){
    try {
        let sql = `
        select * from tbl_redefinirSenha where token = '${token}' and expirado = false order by criacao desc limit 1;
        `

        let result = await prisma.$queryRawUnsafe(sql)
        return result && result.length > 0 ? result[0] : false
    } catch (error) {
        console.error("error ao selecionar por token ", error)
        return false
    }
}

//Função para atualizar o status de expirado
const updateStatusExpirado = async function(id){

    try {
        let sql = `
        update tbl_redefinirSenha set expirado = true where id = ${id};
        `

        let result = await prisma.$executeRawUnsafe(sql)

       if (result) {
        return true
        
       } else {
         return false
       }
    } catch (error) {
        console.error("error ao atualizar status expirado ", error)
        return false
    }
}

module.exports = {
    insertUsuario,
    updateUsuario,
    selectAllUsuario,
    deleteUsuario,
    selectByIdUsuario,
    InsertSenha,
    selectByToken,
    updateStatusExpirado
}
    
