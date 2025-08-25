USE ucr;
DELIMITER $$

-- ==========================
-- TABLA administrador
-- ==========================

DROP PROCEDURE IF EXISTS buscarAdministrador$$
CREATE PROCEDURE buscarAdministrador (_id INT)
BEGIN
    SELECT * FROM administrador WHERE id = _id;
END$$

DROP PROCEDURE IF EXISTS filtrarAdministrador$$
CREATE PROCEDURE filtrarAdministrador (
    _parametros VARCHAR(255),
    _pagina SMALLINT UNSIGNED,
    _cantRegs SMALLINT UNSIGNED
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idAdministrador&nombre&apellido1&apellido2&telefono&correo&direccion&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM administrador WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsAdministrador$$
CREATE PROCEDURE numRegsAdministrador (
    _parametros VARCHAR(255)
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idAdministrador&nombre&apellido1&apellido2&telefono&correo&direccion&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id) FROM administrador WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevoAdministrador$$
CREATE FUNCTION nuevoAdministrador (
    _idAdministrador VARCHAR(15),
    _nombre VARCHAR(30),
    _apellido1 VARCHAR(15),
    _apellido2 VARCHAR(15),
    _telefono VARCHAR(9),
    _correo VARCHAR(100),
    _direccion VARCHAR(255)
) RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT DEFAULT 0;

    SELECT COUNT(*) INTO _cant FROM administrador WHERE idAdministrador = _idAdministrador;

    IF _cant = 0 THEN
        INSERT INTO administrador (idAdministrador, nombre, apellido1, apellido2, telefono, correo, direccion)
        VALUES (_idAdministrador, _nombre, _apellido1, _apellido2, _telefono, _correo, _direccion);
        SET _cant = 0;
    END IF;

    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS eliminarAdministrador$$
CREATE FUNCTION eliminarAdministrador (_id INT)
RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT DEFAULT 0;
    SELECT COUNT(*) INTO _cant FROM administrador WHERE id = _id;
    IF _cant > 0 THEN
        DELETE FROM administrador WHERE id = _id;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarAdministrador$$
CREATE FUNCTION editarAdministrador (
    _id INT,
    _idAdministrador VARCHAR(15),
    _nombre VARCHAR(30),
    _apellido1 VARCHAR(15),
    _apellido2 VARCHAR(15),
    _telefono VARCHAR(9),
    _correo VARCHAR(100),
    _direccion VARCHAR(255)
)
RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM administrador WHERE id = _id;
    IF _cant = 1 THEN
        UPDATE administrador 
        SET idAdministrador = _idAdministrador,
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