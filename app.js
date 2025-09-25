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
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')

dotenv.config()

//Cria um objeto para o body do tipo json 
const bodyParserJSON = bodyParser.json()

//incializando a utilização do express através da variavel app
const app = express()

// request = significa a chegada de dados na api 
// response = saida de dados na api 
// next = 
app.use((request, response, next)=>{
    //permissão de acessi para quem irá criar a API
    response.header('Access-Control-Allow-Origin', '*')
    //permissão de acesso para os metodos da api
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTONS')
    //ativa as configurações do header para o cors 
    app.use(cors())

    next()
})

app.use('/api/auth', authRoutes)

const controllerUsuarios = require ('./controller/usuarios/ControllerUsuarios.js')


// app.post('/v1/controle-usuario/usuario', cors(), bodyParserJSON, async function (request, response) {
//     //Recebe o content-type da requisição 
//     let contentType = request.headers['content-type']
//     //Recebe os dados da requisição 
//     let dadosBody = request.body

//     //Chama função da controller para inserir os dados e aguarda o retorno da função 
//     let resultUsuario = await controllerUsuarios.inserirUsuario(contentType, dadosBody)
//     response.status(resultUsuario.status_code)
//     response.json(resultUsuario)

// })
//Endpoint para inserir uma musica 
app.post('/v1/controle-usuario/usuario', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.headers['content-type']

    //recebe os dados do body da requisição 
    let dadosbody = request.body
   
    //chama a função da controller para inserir os dados e agurada o retorno da função 
    let resultUsuario = await controllerUsuarios.inserirUsuario(contentType, dadosbody)
 
    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})
app.get ('/v1/controle-usuario/usuario', cors(), bodyParserJSON, async function (request, response){
    let id = request.params.id
    let contentType = request.headers ['content-type']

    let dadosBody = request.body

    let resultUsuario = await controllerUsuarios.listarUsuario(dadosBody, contentType)
    response.status (resultUsuario.status_code)
    response.json(resultUsuario)

} )
app.get ('/v1/controle-usuario/usuario/:id', cors(), bodyParserJSON, async function (request, response){
    let id = request.params.id
    let contentType = request.headers ['content-type']

    let dadosBody = request.body

    let resultUsuario = await controllerUsuarios.buscarUsuario(id)
    response.status (resultUsuario.status_code)
    response.json(resultUsuario)

} )

app.put('/v1/controle-usuarios/usuario/:id', cors(), bodyParserJSON, async function (request, response) {


    //Recebe o id da musica
    let idUsuario = request.params.id


    //receber os dados da requisiçao 
    let dadosBody = request.body

    //Recebe o content type 
    let contentType = request.headers['content-type']





    let resultUsuario = await controllerUsuario.atualizarUsuario(idUsuario, dadosBody, contentType)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})
app.post('/v1/controle-arusuariotistas/artista', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']
    //Recebe os dados da requisição 
    let dadosBody = request.body

    //Chama função da controller para inserir os dados e aguarda o retorno da função 
    let resultArtista = await controllerArtista.inserirArtista(dadosBody, contentType)
    response.status(resultArtista.status_code);
    response.json(resultArtista);

})

// // Defina a porta e inicie o servidor
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//     console.log(`Servidor rodando na porta ${PORT}`)
// })

app.listen(8080, function () {
    console.log('API aguardando requisições...')
})