CREATE DATABASE IF NOT EXISTS `neo_bd`;
USE `neo_bd`;

CREATE TABLE IF NOT EXISTS `user` (
  `matricula` varchar(6) NOT NULL DEFAULT '',
  `nome` varchar(50) DEFAULT NULL,
  `empresa` varchar(50) DEFAULT NULL,
  `cargo` varchar(50) DEFAULT NULL,
 PRIMARY KEY (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user` (`matricula`, `nome`, `empresa`, `cargo`) VALUES
	('B14141', 'Gustavo', 'neo bsb', 'tecnico em manutenção');
INSERT INTO `user` (`matricula`, `nome`, `empresa`, `cargo`) VALUES
	('B05021', 'Leandro', 'neo bsb', 'tecnico em manutenção');
INSERT INTO `user` (`matricula`, `nome`, `empresa`, `cargo`) VALUES
	('C45758', 'Jorge', 'neo bsb', 'gerente de operacional');