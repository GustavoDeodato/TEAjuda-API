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



select * from tbl_usuario order by id desc;

CALL InserirUsuario('Teste', 'teste@email.com', '1234');

DROP PROCEDURE IF EXISTS InserirUsuario;