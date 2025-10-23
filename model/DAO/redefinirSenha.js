/*********************************************
 * Objetivo:Model responsavel pelo crud de dados referente á redefinição de senha
 * Data: 30/09/2025
 * Autor: Beatriz Rodrigues
 * Versão 1.0
 * ***********************************************/

//import do prisma
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


//insert
const insertRedefinicao = async function (token, usado, email) {
    try {
        let sql = `
        insert into tbl_recSenha (token, usado, email)
        values (
            '${token}', 
             ${usado}, 
            '${email}'
        );
        `
        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)
        console.log(result)
        if (result) {
            let sqlSelect = `
            select * from tbl_recSenha where email = '${email}' limit 1;
            `

            let criacaoRegistro = await prisma.$queryRawUnsafe(sqlSelect)

            if (criacaoRegistro && criacaoRegistro.length > 0) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}


////token
const selectByToken = async function(token){
    try {
        let sql = `
        select * from tbl_RecSenha where token = ${token} and usado = false 
        and DATE_ADD(data_criacao, INTERVAL 60 MINUTE) > NOW()
        order by data_criacao desc limit 1;
        `
        let result = await prisma.$queryRawUnsafe(sql)
        return result && result.length > 0 ? result[0] : false
    } catch (error) {
        console.error("error ao procurar token", error)
        return false
    }
}

//update quando foi usado
const updateStatusUsado = async function(id){
    try {
        let sql = `
        update tbl_recSenha set usado = true where id = ${id};
        `

        let result = await prisma.$executeRawUnsafe(sql)

       if (result) {
        return true
       } else {
         return false
       }
    } catch (error) {
        return false
    }
}

const updateSenha = async function (id, novaSenha ) {
    try {
        console.log('=== UPDATE SENHA ===')
        console.log('ID do usuário:', id)
        console.log('Hash da nova senha (primeiros 20 chars):', novaSenha ? novaSenha.substring(0, 20) + '...' : 'null')

        let sql = `UPDATE tbl_usuario SET senha = '${novaSenha}' WHERE id = ${id}`
        console.log('SQL:', sql)

        let result = await prisma.$executeRawUnsafe(sql)
        console.log('Linhas afetadas:', result)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.error("Erro ao atualizar senha:", error)
        return false
    }
}

module.exports = {
   insertRedefinicao,
   selectByToken,
   updateStatusUsado,
   updateSenha
}