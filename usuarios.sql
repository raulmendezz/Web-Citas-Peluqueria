-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-03-2026 a las 19:23:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `webcitas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `tipo_usuario` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `contraseña`, `tipo_usuario`) VALUES
(3, 'raul mendez', '$2y$10$NKhPLgOaPgYGiWa.A.a.bOJmrTenXh56qf/r3t3gIKVoSKgkg62za', 'admin'),
(4, 'rauulinyo', '$2y$10$mEyZKNm4AnE3VmDEZbcVMeh1qbjXW3UhIY1xLRIEoSDYUb2YONjA6', 'user'),
(5, 'toniblazquez', '$2y$10$yd/5DzRvp6C.9DBSwGgTL.YP2xDf.HeEkS.RcDZBOhmN42tCXTcC2', 'admin'),
(6, 'pepe', '$2y$10$cHJJWrC1I7/ZW4gZ/rSDvugovhiFPTnpdlqVDHS0xuZBTJw2nvABO', 'user'),
(7, '1234', '$2y$10$SYGNc0p/pyBCME2LyrG88OBvjwgTVu8QUVlOBszSLnQ4xEPaUCYky', 'user'),
(8, 'juanmendez', '$2y$10$KJGfhA8hGcthH81Q9t8BQuljfTI5V1b7PiKvxj82EUFHaHQvhKGVq', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
