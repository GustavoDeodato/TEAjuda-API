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
        let sql = `insert into tbl_usuario (nome, email, senha, nome_tutelado)
        
        values('${usuario.nome}',
                '${usuario.email}',
                '${usuario.senha}',
                '${usuario.nome_tutelado}')`

console.log(sql)
    //Executa o script sql no banco de dados e aguarda o resultado (retornando true ou false)
    let result = await prisma.$executeRawUnsafe(sql)

    

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
        let sql = `update tbl_usuario set nome = '${usuario.nome}',
                    email = '${usuario.email}',
                    senha = '${usuario.senha}',
                    nome_tutelado = '${usuario.nome_tutelado}'
        where id = '${usuario.id}'`

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
        sql = `select * from tbl_usuario order by id desc`

        let result = await prisma.$queryRawUnsafe(sql)

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
        let sql = `select * from tbl_usuario where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else 
          return false

    } catch (error) {
        return false 
    }
    }

module.exports = {
    insertUsuario,
    updateUsuario,
    selectAllUsuario,
    deleteUsuario,
    selectByIdUsuario
}