create database db_teajuda_aa;

use db_teajuda_aa;

create table tbl_usuario(
id int not null primary key auto_increment,
nome varchar(100) not null,
email varchar(255) not null,
senha varchar(100) not null

);

create table tbl_RecSenha(
	id int not null primary key auto_increment,
    token int not null,
    usado boolean not null,
    email varchar(100) not null,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into tbl_usuario(nome, email, senha) values(
'iubanco',
'back@sembanco.com',
'bancodedados'
);

show tables;

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



select * from tbl_usuario order by id desc;

CALL InserirUsuario('Teste', 'teste@email.com', '1234');

DROP PROCEDURE IF EXISTS InserirUsuario;

DELIMITER ;


--buscar por id 
	DELIMITER $$ 
    create procedure search_usuario_id(
		in p_id int 
    )
    begin 
    select * from tbl_usuario 
		where id = p_id;  
    end$$
    DELIMITER ; 

-- delete por id 

    
  DELIMITER $$

  CREATE PROCEDURE delete_usuario_id(IN p_id INT)
  BEGIN
      DELETE FROM tbl_usuario
      WHERE id = p_id;
  END$$

  DELIMITER ;



--criação das view 

CREATE VIEW vw_usuarios AS
SELECT * FROM tbl_usuario;

SELECT * FROM vw_usuarios;
