USE ucr;
SET GLOBAL log_bin_trust_function_creators = 1;
DELIMITER $$

-- ==========================
-- TABLA matricula
-- ==========================

DROP PROCEDURE IF EXISTS buscarMatricula$$
CREATE PROCEDURE buscarMatricula (_id INT)
BEGIN
    SELECT * FROM matricula WHERE id = _id;
END$$

DROP PROCEDURE IF EXISTS filtrarMatricula$$
CREATE PROCEDURE filtrarMatricula (
    _parametros VARCHAR(255),
    _pagina SMALLINT UNSIGNED,
    _cantRegs SMALLINT UNSIGNED
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idEstudiante&idGrupo&fechaMatricula&estado&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM matricula WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsMatricula$$
CREATE PROCEDURE numRegsMatricula (_parametros VARCHAR(255))
BEGIN
    SELECT cadenaFiltro(_parametros, 'idEstudiante&idGrupo&fechaMatricula&estado&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id) FROM matricula WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevaMatricula$$
CREATE FUNCTION nuevaMatricula (
    _idEstudiante VARCHAR(15),
    _idGrupo INT,
    _fechaMatricula varchar(10),
    _estado VARCHAR(20)
) RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM matricula WHERE idEstudiante = _idEstudiante AND idGrupo = _idGrupo;
    IF _cant = 0 THEN
        INSERT INTO matricula(idEstudiante, idGrupo, fechaMatricula, estado)
        VALUES (_idEstudiante, _idGrupo, _fechaMatricula, _estado);
        SET _cant = 0;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarMatricula$$
CREATE FUNCTION editarMatricula (
    _id INT,
    _idEstudiante VARCHAR(15),
    _idGrupo INT,
    _fechaMatricula varchar(10),
    _estado VARCHAR(20)
) RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM matricula WHERE id = _id;
    IF _cant > 0 THEN
        UPDATE matricula SET idEstudiante = _idEstudiante, idGrupo = _idGrupo, fechaMatricula = _fechaMatricula, estado = _estado WHERE id = _id;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS eliminarMatricula$$
CREATE FUNCTION eliminarMatricula (_id INT)
RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _existe INT;
    DECLARE _resp INT DEFAULT 0;

    SELECT COUNT(*) INTO _existe FROM matricula WHERE id = _id;

    IF _existe = 0 THEN
        SET _resp = 0; -- No existe la matrícula
    ELSE
        DELETE FROM matricula WHERE id = _id;
        SET _resp = 1; -- Eliminada correctamente
    END IF;

    RETURN _resp;
END$$

DELIMITER ;