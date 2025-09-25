create database db_teajuda_aa;

use db_teajuda_aa;

create table tbl_usuario(
id int not null primary key auto_increment,
nome varchar(100) not null,
email varchar(100) not null,
senha varchar(100) not null,
nome_tutelado varchar (100) not null

);

insert into tbl_usuario(nome, email, senha, nome_tutelado) values(
'iubanco',
'back@sembanco.com',
'bancodedados',
'bancodedados'
);

show tables;

select * from tbl_usuario order by id desc;

ALTER TABLE tbl_usuario
DROP COLUMN nome_tutelado;

