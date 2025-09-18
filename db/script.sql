create database db_teajuda_aa;

use db_teajuda_aa;

create table tbl_usuario(
	id int not null primary key auto_increment,
    email varchar(100) not null, 
    senha varchar(100) not null, 
    nome_tutelado varchar (100) not null

);

show tables;