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
const insertRedefinicao = async function (id, token, usado ){
    try {
        let sql = `
        insert into tbl_recSenha (id, token,  usado)
        values (
            ${id}, 
            '${token}', 
            '${data_expiracao.toISOString().slice(0, 19).replace('T', ' ')}'
         );
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            let sql = `
             select * from tbl_recSenha where id = ${id} order by criacao desc limit 1;
            `

            let criacaoRegistro = await prisma.$queryRawUnsafe(sql)
            return criacaoRegistro[0]
        }else{
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
        select * from tbl_redefinirSenha where token = '${token}' and expirado = false order by criacao desc limit 1;
        `

        let result = await prisma.$queryRawUnsafe(sql)
        return result && result.length > 0 ? result[0] : false
    } catch (error) {
        console.error("error ao selecionar por token ", error)
        return false
    }
}

//update quando foi usado
const updateStatusUsado = async function(id){

    try {
        let sql = `
        update tbl_recSenha set expirado = true where id = ${id};
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

const senhaAtualizada = async function (id, ) {
    try {

        let sql = ` update tbl_usuario set senha_hash = '${novaSenha}'  where id = ${id}
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log("error ao atualizar senha")
    }
}

module.exports = {
   insertRedefinicao,
   selectByToken,
   updateStatusUsado,
   senhaAtualizada
}