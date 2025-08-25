SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de datos: ucr
-- DROP DATABASE IF EXISTS ucr;
-- CREATE DATABASE ucr DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE ucr;

-- Tabla estudiante
DROP TABLE IF EXISTS estudiante;
CREATE TABLE estudiante (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idEstudiante VARCHAR(15) NOT NULL,
  nombre VARCHAR(30) COLLATE utf8_spanish_ci NOT NULL,
  apellido1 VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL,
  apellido2 VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL,
  telefono VARCHAR(9) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) COLLATE utf8_spanish_ci,
  fechaIngreso DATETIME DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE KEY idx_estudiante (idEstudiante),
  UNIQUE KEY idx_correoEstudiante (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


-- Tabla profesor
DROP TABLE IF EXISTS profesor;
CREATE TABLE profesor (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idProfesor VARCHAR(15) NOT NULL,
  nombre VARCHAR(30) COLLATE utf8_spanish_ci NOT NULL,
  apellido1 VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL,
  apellido2 VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL,
  telefono VARCHAR(9) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) COLLATE utf8_spanish_ci,
  fechaIngreso DATETIME DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE KEY idx_idProfesor (idProfesor),
  UNIQUE KEY idx_correoProfesor (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Tabla administrador
DROP TABLE IF EXISTS administrador;
CREATE TABLE administrador (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idAdministrador VARCHAR(15) NOT NULL,
  nombre VARCHAR(30) COLLATE utf8_spanish_ci NOT NULL,
  apellido1 VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL,
  apellido2 VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL,
  telefono VARCHAR(9) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) COLLATE utf8_spanish_ci,
  fechaIngreso DATETIME DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE KEY idx_idAdministrador (idAdministrador),
  UNIQUE KEY idx_correoAdmin (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Tabla curso
DROP TABLE IF EXISTS curso;
CREATE TABLE curso (
  id INT(11) NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(15) NOT NULL,
  nombre VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL,
  descripcion VARCHAR(255) COLLATE utf8_spanish_ci,
  duracion INT NOT NULL, -- en horas
  cupoMaximo INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY idx_codigoCurso (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Tabla grupo
DROP TABLE IF EXISTS grupo;
CREATE TABLE grupo (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idCurso INT(11) NOT NULL,
  idProfesor VARCHAR(15) NOT NULL,
  fechaInicio VARCHAR(10) NOT NULL,
  fechaFin VARCHAR(10) NOT NULL,
  horario VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL,
  aula VARCHAR(50) COLLATE utf8_spanish_ci,
  PRIMARY KEY (id),
  FOREIGN KEY (idCurso) REFERENCES curso(id),
  FOREIGN KEY (idProfesor) REFERENCES profesor(idProfesor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Tabla matricula
DROP TABLE IF EXISTS matricula;
CREATE TABLE matricula (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idEstudiante VARCHAR(15) NOT NULL,
  idGrupo INT(11) NOT NULL,
  fechaMatricula varchar(10) NOT NULL,
  estado VARCHAR(20) COLLATE utf8_spanish_ci DEFAULT 'Activa', -- Activa, Retirada, Finalizada
  PRIMARY KEY (id),
  UNIQUE KEY idx_matriculaUnica (idEstudiante, idGrupo),
  FOREIGN KEY (idEstudiante) REFERENCES estudiante(idEstudiante),
  FOREIGN KEY (idGrupo) REFERENCES grupo(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Tabla usuario (para login y control de acceso)
DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idUsuario VARCHAR(15) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  rol INT NOT NULL, -- 1: admin, 2: profesor, 3: estudiante
  passw VARCHAR(255) NOT NULL,
  ultimoAcceso DATETIME,
  tkRef VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY idx_idUsuario (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Tabla evaluación
DROP TABLE IF EXISTS evaluacion;
CREATE TABLE evaluacion (
  id INT(11) NOT NULL AUTO_INCREMENT,
  idMatricula INT(11) NOT NULL,
  nota DECIMAL(5,2) NOT NULL,
  observaciones VARCHAR(255) COLLATE utf8_spanish_ci,
  fechaEvaluacion varchar(10) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (idMatricula) REFERENCES matricula(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

COMMIT;
