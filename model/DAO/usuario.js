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

     if(result)
         return true 
        else 
         return false 

    } catch (error) {
        return false 
    }
}
//Função para atualizar uma usuario existente 
const updateUsuario = async function (usuario){
    try {
        let sql = `update tbl_usuario set 
                    nome = '${usuario.nome}',
                    email = '${usuario.email}',
                    senha = '${usuario.senha}'
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

        result = await prisma.$executeRaw`CALL delete_usuario_id (${id});`

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

const selectByEmailUsuario = async function (email) {
    try {
        let sql = `SELECT * FROM tbl_usuario WHERE email = '${email}'`
        let result = await prisma.$queryRawUnsafe(sql)
        if(result)
        return true
        else
        return false 
            
    } catch (error) {
        console.log("ERRO AO BUSCAR USUARIO POR EMAIL:", error)
        return false
    }
}
module.exports = {
    insertUsuario,
    updateUsuario,
    selectAllUsuario,
    deleteUsuario,
    selectByIdUsuario,
    selectByEmailUsuario
}
    
