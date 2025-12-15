DROP DATABASE IF exists Petshop;

CREATE DATABASE Petshop;
USE Petshop;

CREATE TABLE especie (
Id_Especie int NOT NULL AUTO_INCREMENT,
Nome_Especie varchar(100) NOT NULL,
primary key(Id_Especie)
);

CREATE TABLE raca(
Id_Raca INT NOT NULL auto_increment,
Id_Especie INT NOT NULL,
Nome_Raca varchar(100) NOT NULL,
Raca_Peculiaridade TEXT,
primary key(Id_Raca),
foreign key(Id_Especie) references especie(Id_Especie)                                                   
);

CREATE TABLE pet(
Id_Pet int not null auto_increment,
Nome_Pet varchar(100) not null,
Id_Raca int not null,
Pet_Peculiaridade TEXT,
Pet_foto text, 
Dono_Pet varchar(100) not null,
Dono_Contato varchar(100),
primary key(Id_Pet),
foreign key(Id_Raca) references raca(Id_Raca)
);

CREATE TABLE prontuario(
Id_Prontuario int not null auto_increment,
Id_Pet int not null,
Data_Prontuario Date not null,
Observacao text,
primary key(Id_Prontuario,Id_Pet,Data_Prontuario),
foreign key(Id_Pet) references pet(Id_Pet)
);
INSERT INTO especie (Nome_Especie) VALUES
('Cachorro'),
('Gato'),
('Pássaro'),
('Roedor');

INSERT INTO raca (Id_Especie, Nome_Raca, Raca_Peculiaridade) VALUES
(1, 'Labrador Retriever', 'Temperamento dócil, bom para famílias.'),
(1, 'Pastor Alemão', 'Inteligente e fácil de treinar.'),
(2, 'Siamês', 'Vocal e muito afetuoso.'),
(2, 'Persa', 'Pelagem longa, requer escovação regular.'),
(3, 'Calopsita', 'Pássaro de companhia, pode aprender a assobiar.'),
(4, 'Hamster Sírio', 'Comportamento noturno, solitário.');

INSERT INTO pet (Nome_Pet, Id_Raca, Pet_Peculiaridade, Pet_foto, Dono_Pet, Dono_Contato) VALUES
('Rex', 1, 'Gosta de buscar bolinhas.', '../../server/foto_1.png', 'Ana Silva', '(11) 98765-4321'),
('Miau', 3, 'Muito ciumento, só come ração molhada.', '../../server/foto_2.png', 'Bruno Mendes', '(21) 99887-6655'),
('Apollo', 5, 'Assobia o hino nacional.', '../../server/foto_3.png', 'Carla Torres', '(31) 97654-3210'),
('Fido', 2, 'Cão de guarda treinado.', NULL, 'Daniel Costa', '(41) 96543-2109'),
('Princesa', 4, 'Alérgica a peixe.', '../../server/foto_5.png', 'Elisa Rocha', '(51) 95432-1098');

INSERT INTO prontuario (Id_Pet, Data_Prontuario, Observacao) VALUES
(1, '2025-10-01', 'Vacina V8 anual aplicada. Peso: 30kg. Sem alterações.'),
(2, '2025-10-05', 'Consulta de rotina. Prurido leve na orelha direita. Prescrito Otomax por 7 dias.'),
(5, '2025-10-15', 'Tratamento de tártaro realizado. Anestesia bem tolerada.'),
(1, '2025-11-01', 'Tosa completa. Pet agitado durante o banho, mas cooperou na tosa.'),
(3, '2025-11-10', 'Check-up anual. Penas brilhantes, peso estável. Recomendado suplemento vitamínico para aves.');

