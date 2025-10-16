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

//endpoint para inserir um usuario
app.post('/v1/teajuda/usuario', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.headers['content-type']

    //recebe os dados do body da requisição 
    let dadosbody = request.body
   
    //chama a função da controller para inserir os dados e agurada o retorno da função 
    let resultUsuario = await controllerUsuarios.inserirUsuario(contentType, dadosbody)
 
    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

//endpoint para selecionar todos os usuarios 
app.get ('/v1/teajuda/usuario',  async function (request, response){

    let resultUsuario = await controllerUsuarios.listarUsuario()

    response.status (resultUsuario.status_code)
    response.json(resultUsuario)

} )
app.get ('/v1/teajuda/usuario/:id', async function (request, response){
    let id = request.params.id

    let resultUsuario = await controllerUsuarios.buscarUsuario(id)
    response.status (resultUsuario.status_code)
    response.json(resultUsuario)

} )
app.put('/v1/teajuda/usuario/:id',  bodyParser.json(), async  (request, response) => {

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
app.delete('/v1/teajuda/usuario/:id', async function (request, response) {
    let idUsuario = request.params.id
    let resultUsuario = await controllerUsuarios.excluirUsuario(idUsuario)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)
})

//endpoint de login 
app.post('/v1/teajuda/usuario/login', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultUsuario = await controllerUsuarios.LoginUsuario( contentType, dadosBody)

    response.status(resultUsuario.status_code)
    response.json(resultUsuario)

})

/////////////////////////////////////////////////// G M A I L ///////////////////////////////////////////////////////////////
// require('dotenv').config()
// const session = require('express-session')
// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth20').Strategy


// app.use(passport.initialize())
// app.use(passport.session())

// passport.serializeUser((user, done) => {
//   done(null, user.id)
// })

// passport.deserializeUser(async (id, done) => {
//   const user = await prisma.usuario.findUnique({ where: { id } })
//   done(null, user)
// })

// // Config Google OAuth
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: process.env.GOOGLE_CALLBACK_URL
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     const email = profile.emails[0].value
//     const nome = profile.displayName

//     let usuario = await prisma.usuario.findUnique({
//       where: { email }
//     })

//     // Se não existir, cria
//     if (!usuario) {
//       usuario = await prisma.usuario.create({
//         data: { nome, email }
//       })
//     }

//     return done(null, usuario)
//   } catch (error) {
//     return done(error, null)
//   }
// }))

// // Rota inicial
// app.get('/', (req, res) => {
//   res.send('<a href="/auth/google">Entrar com Google</a>')
// })

// // Login Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// )

// // Callback Google
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/perfil')
//   }
// )

// // Perfil do usuário
// app.get('/perfil', async (req, res) => {
//   if (!req.user) return res.redirect('/')
//   res.send(`
//     <h1>Bem-vindo, ${req.user.nome}</h1>
//     <p>Email: ${req.user.email}</p>
//     <br><a href="/logout">Sair</a>
//   `)
// })

// // Logout
// app.get('/logout', (req, res) => {
//   req.logout(() => res.redirect('/'))
// })



/////////////////////////////////////////////////// RECUPERAR SENHA ///////////////////////////////////////////////////////



app.post('/v1/teajuda/solicitacao-de-senha',bodyParserJSON, async function(request, response){
   let contentType = request.headers['content-type']
   let dadosBody = request.body

   let resultRedefinicao = await ControllerRedefinir.solicitarRedefinicao(dadosBody, contentType)

   response.status(resultRedefinicao.status_code || 200)
   response.json(resultRedefinicao)

})

app.post('/v1/teajuda/validar-token', bodyParserJSON, async (request, response) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultToken = await ControllerRedefinir.validarToken(dadosBody, contentType)

    response.status(resultToken.status_code || 200)
    response.json(resultToken)
})

app.listen(8080, function () {
    console.log('API aguardando requisições...')
})