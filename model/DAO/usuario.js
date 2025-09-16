/*********************************************
 * Objetivo: criar o CRUD de dados da tabela usuarios no banco de dados 
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ********************************************** */

const {PrismaClient} = require('@prisma/client')

const insertUsuario = async function(usuario){
    try {
        let sql = `insert into tbl_usuario (nome, email, senha, nome_tutelado)
        
        values('${usuario.nome}'),
        values('${usuario.email}'),
        values('${usuario.senha}'),
        values('${usuario.nome_tutelado}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true 
        else return false 
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateUsuarios = async function (id) {
    
}

const selectAllUsuarios = async function () {
    try {
        sql = `select * from tbl_usuario order by id desc`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true 
        else 
        return false 
    } catch (error) {
        console.log(error)
        return false 
        
    }
}

const selectByIdUsuarios = async function (id){
    try {
        let sql = `select * from tbl_usuario where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return true 
        else return false 
    } catch (error) {
        console.log(error)
        return false 
    }
    
}

const deleteUsuarios = async function (id){
    try {
        let sql = `delete * from tbl_usuario where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true 
        else return false 
    } catch (error) {
        console.log(error)
        return false 
    }

}

module.exports = {
    insertUsuario,
    deleteUsuarios,
    selectAllUsuarios,
    selectByIdUsuarios,
    updateUsuarios
}