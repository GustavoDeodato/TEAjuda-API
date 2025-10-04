/*********************************************
 * Objetivo: criar uma API para realizar integração com db 
 * Data: 16/09/2025
 * Autor: Gustavo Deodato
 * 
 * Versão 1.0
 * Observações: 
 * Para criar a Api é necessario 
 *          express                        npm install express --save
 *          cors                           npm install cors --save
 *          body-parser                    npm install body-parser --save
 * 
 * Para a conexão com o db 
 * 
 *           prisma                        npm install prisma --save 
 *           prisma/client                 npm install @prisma/client --save
 * 
 * 
 * 
 * Após a instalação do prisma e @prisma/client, devemos:
 * 
 *      npx prisma init                         Para inicializar o prisma no projeto 
 * 
 * Após esse comando você deverá configurar o .env e o schema.prisma, e rodar o comando: 
 * 
 *          npx prisma migrate dev  
 * ********************************************** */


//import das bibliotecas para a api
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const authRoutes = require('./routes/authRoutes.js')
const controllerUsuarios = require ('./controller/usuarios/ControllerUsuarios.js')
const ControllerRedefinir = require('./controller/redefinirSenha/ControllerRedefinirSenha.js')


//Cria um objeto para o body do tipo json 
const bodyParserJSON = bodyParser.json()

//incializando a utilização do express através da variavel app
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// request = significa a chegada de dados na api 
// response = saida de dados na api 
// next = 
app.use((request, response, next)=>{
    //permissão de acessi para quem irá criar a API
    response.header('Access-Control-Allow-Origin', '*')
    //permissão de acesso para os metodos da api
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
   
    next()
})


//Endpoint's para API de usuarios
app.post('/v1/controle-usuario/usuario', async function(request, response){

    let contentType = request.headers['content-type']

    //recebe os dados do body da requisição 
    let dadosbody = request.body
   
    //chama a função da controller para inserir os dados e agurada o retorno da função 
    let resultUsuario = await controllerUsuarios.inserirUsuario(dadosbody, contentType)
 
    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})
app.get ('/v1/controle-usuario/usuario',  async function (request, response){

    let resultUsuario = await controllerUsuarios.listarUsuario()

    response.status (resultUsuario.status_code)
    response.json(resultUsuario)

} )
app.get ('/v1/controle-usuario/usuario/:id', async function (request, response){
    let id = request.params.id

    let resultUsuario = await controllerUsuarios.buscarUsuario(id)
    response.status (resultUsuario.status_code)
    response.json(resultUsuario)

} )
app.put('/v1/controle-usuario/usuario/:id',  bodyParser.json(), async  (request, response) => {

    //Recebe o id do usuario
    let idUsuario = request.params.id

    //receber os dados da requisiçao 
    let dadosBody = request.body

    //Recebe o content type 
    let contentType = request.headers['content-type']
    console.log(contentType)


    let resultUsuario = await controllerUsuarios.atualizarUsuario(dadosBody, idUsuario, contentType)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})
app.delete('/v1/controle-usuario/usuario/:id', async function (request, response) {
    let idUsuario = request.params.id
    let resultUsuario = await controllerUsuarios.excluirUsuario(idUsuario)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

///Endpoint's para API de redefinição de senha

app.post('/v1/controle-usuario/solicitacao-de-senha',bodyParserJSON, async function(request, response){
   let contentType = request.headers['content-type']
   let dadosBody = request.body

   let resultRedefinicao = await ControllerRedefinir.solicitarRedefinicao(dadosBody, contentType)

   response.status(resultRedefinicao.status_code || 200)
   response.json(resultRedefinicao)

})

app.post('/v1/controle-usuario/validar-token', bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultToken = await ControllerRedefinir.validarToken(dadosBody, contentType)

    response.status(resultToken.status_code || 200)
    response.json(resultToken)
})
/////////////////////////////////////////////////// RECUPERAR SENHA ///////////////////////////////////////////////////////


app.post('/v1/controle-usuario/redefinir-senha', bodyParserJSON, async (request, response) => {
    const contentType = request.headers['content-type'];

    const dadosBody = request.body;

    const resultRedefinir = await ControllerRedefinir.solicitarRedefinicao(dadosBody.email, contentType);


    response.status(resultRedefinir.status_code || 200);
    response.json(resultRedefinir);
})

app.listen(8080, function () {
    console.log('API aguardando requisições...')
})