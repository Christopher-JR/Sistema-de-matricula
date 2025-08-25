USE ucr;
DELIMITER $$

-- ==========================
-- TABLA profesor
-- ==========================

DROP PROCEDURE IF EXISTS buscarProfesor$$
CREATE PROCEDURE buscarProfesor (_id INT)
BEGIN
    SELECT * FROM profesor WHERE id = _id;
END$$

DROP PROCEDURE IF EXISTS filtrarProfesor$$
CREATE PROCEDURE filtrarProfesor (
    _parametros VARCHAR(255),
    _pagina SMALLINT UNSIGNED,
    _cantRegs SMALLINT UNSIGNED
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idProfesor&nombre&apellido1&apellido2&telefono&correo&direccion&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM profesor WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsProfesor$$
CREATE PROCEDURE numRegsProfesor (
    _parametros VARCHAR(255)
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idProfesor&nombre&apellido1&apellido2&telefono&correo&direccion&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id) FROM profesor WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevoProfesor$$
CREATE FUNCTION nuevoProfesor (
    _idProfesor VARCHAR(15),
    _nombre VARCHAR(30),
    _apellido1 VARCHAR(15),
    _apellido2 VARCHAR(15),
    _telefono VARCHAR(9),
    _correo VARCHAR(100),
    _direccion VARCHAR(255)
) RETURNS INT(1)
BEGIN
    DECLARE _cant INT DEFAULT 0;

    SELECT COUNT(*) INTO _cant FROM profesor WHERE idProfesor = _idProfesor;

    IF _cant = 0 THEN
        INSERT INTO profesor (idProfesor, nombre, apellido1, apellido2, telefono, correo, direccion)
        VALUES (_idProfesor, _nombre, _apellido1, _apellido2, _telefono, _correo, _direccion);
        SET _cant = 0;
    END IF;

    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS eliminarProfesor$$
CREATE FUNCTION eliminarProfesor (_id INT)
RETURNS INT(1)
BEGIN
    DECLARE _cant INT DEFAULT 0;
    SELECT COUNT(*) INTO _cant FROM profesor WHERE id = _id;
    IF _cant > 0 THEN
        DELETE FROM profesor WHERE id = _id;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarProfesor$$
CREATE FUNCTION editarProfesor (
    _id INT,
    _idProfesor VARCHAR(15),
    _nombre VARCHAR(30),
    _apellido1 VARCHAR(15),
    _apellido2 VARCHAR(15),
    _telefono VARCHAR(9),
    _correo VARCHAR(100),
    _direccion VARCHAR(255)
)
RETURNS INT(1)
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM profesor WHERE id = _id;
    IF _cant = 1 THEN
        UPDATE profesor 
        SET idProfesor = _idProfesor,
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