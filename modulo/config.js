/***************************************************
 * Objetivo: Arquivo responsável pela padronização de mensagens de status code
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ********************************************** */

/****************  STATUS CODE DE ERROS***********************/

const ERROR_REQUIRED_FIELDS = {status: false, 
    status_code:400, 
    message: "Existem campos de preenchimento obrigatórios ou quantidade de caracteres que não foram atendidos na requisição"}

const ERROR_INTERNAL_SERVER_MODEL = {status: false, status_code:500, message: "Devido a um erro interno no servidor da MODEL, não foi possível processar a requisição"}

const ERROR_INTERNAL_SERVER_CONTROLLER = {status: false, status_code:500, message: "Devido a um erro interno no servidor da CONTROLLER, não foi possível processar a requisição"}


const ERROR_CONTENT_TYPE = {status: false, status_code:415, message: "O content-type não é suportado pelo servidor. Você deve encaminhar conteúdos apenas no formato JSON."}


const ERROR_NOT_FOUND = {status: false, status_code: 404, message: "Não foram encontrados itens de retorno."}

    /******************  STATUS CODE SUCESS  ******************************/

    const SUCESS_CREATED_ITEM = {status: true, status_code: 201, message: "Item criado com sucesso"}

    const SUCESS_DELETE_ITEM = {status: true, status_code: 200, message: "Item excluído com sucesso"}

    const SUCESS_UPDATE_ITEM = {status: true, status_code: 200, message: "Item atualizado com sucesso"}


    module.exports = {
        ERROR_REQUIRED_FIELDS,
        SUCESS_CREATED_ITEM,
        SUCESS_DELETE_ITEM,
        SUCESS_UPDATE_ITEM,
        ERROR_INTERNAL_SERVER_CONTROLLER,
        ERROR_INTERNAL_SERVER_MODEL,
        ERROR_CONTENT_TYPE,
        ERROR_NOT_FOUND
    }