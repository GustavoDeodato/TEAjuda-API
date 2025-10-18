📖 API TEAjuda
O que é a TEAjuda?
TEAjuda é um projeto com o intuito de auxiliar cuidadores de individuos TEA, para o controle e registro geral de suas rotinas.
🎯 Descrição Geral
Esta API é o módulo central de Gerenciamento e Autenticação de Usuários do projeto TEAjuda. Ela fornece um conjunto completo de endpoints RESTful para realizar operações CRUD (Create, Read, Update, Delete), além de um endpoint específico para autenticação (login), e mais funções que serão adicionais no decorrer do projeto.

O objetivo principal é garantir que a aplicação tenha um sistema robusto para:

Cadastro de novos usuários.

Consulta e listagem de usuários existentes.

Atualização e Exclusão de perfis.

Autenticação simples baseada em credenciais.

Recuperação de senha por email 

🏗️ Estrutura do Projeto (Conceitual)

Controller: Responsável por receber os dados da rota, validar os parâmetros, e invocar as funções de negócio (Lógica de Negócio/DAO).

Lógica de Negócio (Service/Model): Camada onde as regras de negócio e a comunicação com o banco de dados (DAO) são executadas, garantindo a integridade dos dados.

🔗 URL Base
http://localhost:8080

[HOST]/v1/teajuda

ou

http://localhost:8080/v1/teajuda

🚀 Documentação dos Endpoints


