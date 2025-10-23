📖 API de Controle de Usuários
🎯 Descrição Geral
Esta API é o módulo central de Gerenciamento e Autenticação de Usuários do projeto. Ela fornece um conjunto completo de endpoints RESTful para realizar operações CRUD (Create, Read, Update, Delete) em registros de usuários, além de um endpoint específico para autenticação (login).

O objetivo principal é garantir que a aplicação tenha um sistema robusto para:

Cadastro de novos usuários.

Consulta e listagem de usuários existentes.

Atualização e Exclusão de perfis.

Autenticação simples baseada em credenciais.

🏗️ Estrutura do Projeto (Conceitual)
Embora você vá implementar o projeto, a estrutura da API sugere uma arquitetura em camadas para organização e manutenibilidade:

Rotas/Endpoints (Routes): Onde os caminhos (/v1/...) são definidos e as requisições HTTP são recebidas. É o que está sendo documentado abaixo.

Controller: Responsável por receber os dados da rota, validar os parâmetros, e invocar as funções de negócio (Lógica de Negócio/DAO).

Lógica de Negócio (Service/Model): Camada onde as regras de negócio e a comunicação com o banco de dados (DAO) são executadas, garantindo a integridade dos dados.

🔗 URL Base
Todos os endpoints utilizam a seguinte URL base (o host deve ser definido na implantação, ex: http://localhost:8080):

[HOST]/v1/controle-usuario

ou

[HOST]/v1/controle-usuarios

🚀 Documentação dos Endpoints
1. Cadastro de Novo Usuário (CREATE)
Cria um novo registro de usuário no sistema.

Método

Caminho

Descrição

POST

/v1/controle-usuario/usuario

Insere os dados de um novo usuário.

Corpo da Requisição (Content-Type: application/json):

Propriedade

Tipo

Obrigatório

Exemplo

nome

string

Sim

"João Silva"

email

string

Sim

"joao.silva@exemplo.com"

senha

string

Sim

"senha123"

(outros campos)

depende

depende



Resposta Esperada (Exemplo de Sucesso - 201):

{
  "usuario": {
    "id": 101,
    "nome": "João Silva",
    "email": "joao.silva@exemplo.com"
  },
  "message": "Usuário criado com sucesso!"
}

2. Listagem de Usuários (READ ALL)
Retorna a lista completa de todos os usuários cadastrados.

Método

Caminho

Descrição

GET

/v1/controle-usuario/usuario

Lista todos os usuários.

Resposta Esperada (Exemplo de Sucesso - 200):

{
  "usuarios": [
    { "id": 101, "nome": "João Silva", "email": "joao.silva@exemplo.com" },
    { "id": 102, "nome": "Maria Santos", "email": "maria.santos@exemplo.com" }
  ]
}

3. Busca de Usuário por ID (READ BY ID)
Retorna os detalhes de um usuário específico, utilizando seu ID como parâmetro.

Método

Caminho

Descrição

GET

/v1/controle-usuario/usuario/:id

Busca um usuário pelo ID.

Parâmetros de Rota:

Parâmetro

Tipo

Descrição

id

int

ID do usuário a ser buscado.

Resposta Esperada (Exemplo de Sucesso - 200):

{
  "usuario": {
    "id": 101,
    "nome": "João Silva",
    "email": "joao.silva@exemplo.com"
  }
}

4. Atualização de Usuário (UPDATE)
Atualiza as informações de um usuário existente, identificado pelo seu ID.

Método

Caminho

Descrição

PUT

/v1/controle-usuario/usuario/:id

Atualiza os dados de um usuário pelo ID.

Parâmetros de Rota:

Parâmetro

Tipo

Descrição

id

int

ID do usuário a ser atualizado.

Corpo da Requisição (Content-Type: application/json):
Deve conter os campos que serão atualizados (parcial ou total).

Propriedade

Tipo

Obrigatório

Exemplo

nome

string

Não

"João V. Silva"

email

string

Não

"novo.email@exemplo.com"

Resposta Esperada (Exemplo de Sucesso - 200):

{
  "usuario": {
    "id": 101,
    "nome": "João V. Silva",
    "email": "novo.email@exemplo.com"
  },
  "message": "Usuário atualizado com sucesso!"
}

5. Exclusão de Usuário (DELETE)
Remove um registro de usuário permanentemente, identificado pelo seu ID.

Método

Caminho

Descrição

DELETE

/v1/controle-usuario/usuario/:id

Exclui um usuário pelo ID.

Parâmetros de Rota:

Parâmetro

Tipo

Descrição

id

int

ID do usuário a ser excluído.

Resposta Esperada (Exemplo de Sucesso - 204 ou 200):

{
  "message": "Usuário excluído com sucesso!"
}

(Se o status code for 204 No Content, o corpo da resposta deve ser vazio.)

6. Login de Usuário (AUTHENTICATION)
Realiza a autenticação de um usuário com base no nome e email fornecidos.

Método

Caminho

Descrição

POST

/v1/controle-usuarios/usuario/login/:nome/:email

Realiza o login do usuário.

Parâmetros de Rota:

Parâmetro

Tipo

Descrição

nome

string

Nome do usuário.

email

string

Email do usuário.

Resposta Esperada (Exemplo de Sucesso - 200):
(Assume-se que, após o login, o endpoint retorne os dados do usuário logado e possivelmente um token de autenticação, se houver.)

{
  "usuario": {
    "id": 101,
    "nome": "João Silva",
    "email": "joao.silva@exemplo.com",
    "token": "seu-jwt-token-aqui-se-aplicavel" 
  },
  "message": "Login realizado com sucesso!"
}

Observação sobre o Login: Este endpoint está utilizando nome e email como parâmetros de rota. Para ambientes de produção, geralmente é mais seguro usar Headers de Autorização ou um Corpo de Requisição (Body) para transmitir credenciais.

