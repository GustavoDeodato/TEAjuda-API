-- CreateTable
-- CREATE TABLE `tbl_usuario` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `nome` VARCHAR(100) NOT NULL,
--     `senha` VARCHAR(100) NOT NULL,
--     `email` VARCHAR(100) NOT NULL,

--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

create database db_teajuda_aa;

use db_teajuda_aa;

create table tbl_usuario(
id int not null primary key auto_increment,
nome varchar(100) not null,
email varchar(100) not null,
senha varchar(100) not null
);

insert into tbl_usuario(nome, email, senha) values(
'iubanco',
'back@sembanco.com',
'bancodedados'
);

show tables;

ALTER TABLE tbl_usuario
ADD COLUMN token VARCHAR(6) NOT NULL DEFAULT '000000',
ADD COLUMN data_expiracao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN expirado BOOLEAN DEFAULT FALSE;


--criação das producere

DELIMITER $$

CREATE PROCEDURE InserirUsuario(
    IN p_nome VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_senha VARCHAR(100)
)
BEGIN
    INSERT INTO tbl_usuario (nome, email, senha)
    VALUES (p_nome, p_email, p_senha);

END$$

DELIMITER ;

alter table

select * from tbl_usuario order by id desc;

CALL InserirUsuario('Teste', 'teste@email.com', '1234');

DROP PROCEDURE IF EXISTS InserirUsuario;

--criação das view

CREATE VIEW vw_usuarios AS
SELECT *
FROM tbl_usuario;

SELECT * FROM vw_usuarios;
