USE ucr;
SET GLOBAL log_bin_trust_function_creators = 1;
DELIMITER $$

-- ==========================
-- TABLA estudiante
-- ==========================
DROP PROCEDURE IF EXISTS buscarEstudiante$$
CREATE PROCEDURE buscarEstudiante (_id INT)
BEGIN SELECT * FROM estudiante WHERE id = _id; END$$

DROP PROCEDURE IF EXISTS filtrarEstudiante$$
CREATE PROCEDURE filtrarEstudiante (
    _parametros VARCHAR(255),
    _pagina SMALLINT UNSIGNED,
    _cantRegs SMALLINT UNSIGNED
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idEstudiante&nombre&apellido1&apellido2&telefono&correo&direccion&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM estudiante WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsEstudiante$$
CREATE PROCEDURE numRegsEstudiante (
    _parametros VARCHAR(255)
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idEstudiante&nombre&apellido1&apellido2&telefono&correo&direccion&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id) FROM estudiante WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevoEstudiante$$
CREATE FUNCTION nuevoEstudiante (
    _idEstudiante VARCHAR(20),
    _nombre VARCHAR(50),
    _apellido1 VARCHAR(15),
    _apellido2 VARCHAR(15),
    _telefono VARCHAR(20),
    _correo VARCHAR(100),
    _direccion VARCHAR(255)
) RETURNS INT(1)
BEGIN
    DECLARE _cant INT DEFAULT 0;

    SELECT COUNT(*) INTO _cant FROM estudiante WHERE idEstudiante = _idEstudiante;

    IF _cant = 0 THEN
        INSERT INTO estudiante (idEstudiante, nombre, apellido1, apellido2, telefono, correo, direccion)
        VALUES (_idEstudiante, _nombre, _apellido1, _apellido2, _telefono, _correo, _direccion);
        SET _cant = 0;
    END IF;

    RETURN _cant;
END$$


DROP FUNCTION IF EXISTS eliminarEstudiante$$
CREATE FUNCTION eliminarEstudiante (_id INT)
RETURNS INT(1)
BEGIN
    DECLARE _cant INT DEFAULT 0;
    SELECT COUNT(*) INTO _cant FROM estudiante WHERE id = _id;
    IF _cant > 0 THEN
        DELETE FROM estudiante WHERE id = _id;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarEstudiante$$
CREATE FUNCTION editarEstudiante (
    _id INT,
    _idEstudiante VARCHAR(20),
    _nombre VARCHAR(50),
    _apellido1 VARCHAR(15),
    _apellido2 VARCHAR(15),
    _telefono VARCHAR(20),
    _correo VARCHAR(100),
    _direccion VARCHAR(255)
)
RETURNS INT(1)
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM estudiante WHERE id = _id;
    IF _cant = 1 THEN
        UPDATE estudiante 
        SET idEstudiante = _idEstudiante,
            nombre = _nombre,
            apellido1 = _apellido1,
            apellido2 = _apellido2,
            telefono = _telefono,
            correo = _correo,
            direccion = _direccion
        WHERE id = _id;
        SET _cant = 0;
    ELSE
        SET _cant = 1;
    END IF;
    RETURN _cant;

END$$

DELIMITER ;