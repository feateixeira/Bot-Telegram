-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           5.6.35 - MySQL Community Server (GPL)
-- OS do Servidor:               Win32
-- HeidiSQL Versão:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para neo_bd
CREATE DATABASE IF NOT EXISTS `neo_bd` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `neo_bd`;

-- Copiando estrutura para tabela neo_bd.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_telegram` int(11) NOT NULL,
  `nome_completo` text,
  `first_name` text,
  `last_name` text,
  `telefone` tinytext,
  `empresa` text,
  `area_atuacao` text,
  `matricula` varchar(50) DEFAULT NULL,
  `nivel_permissao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_telegram`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela neo_bd.usuarios: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`id_telegram`, `nome_completo`, `first_name`, `last_name`, `telefone`, `empresa`, `area_atuacao`, `matricula`, `nivel_permissao`) VALUES
	(2031267286, 'Luiz Miguel de Castro Vieira', 'Luiz', 'Miguel', '6199177777', 'NEO BSB', 'Desempenho', NULL, NULL);
    INSERT INTO `usuarios` (`id_telegram`, `nome_completo`, `first_name`, `last_name`, `telefone`, `empresa`, `area_atuacao`, `matricula`, `nivel_permissao`) VALUES
	(1251392960, 'Fellipe Augusto Teixeira de Aguiar', 'Fellipe', 'Teixeira', '61999098562', 'NEO BSB', 'Desempenho', NULL, NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
