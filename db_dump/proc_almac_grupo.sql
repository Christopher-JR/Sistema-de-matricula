USE ucr;
SET GLOBAL log_bin_trust_function_creators = 1;
DELIMITER $$

-- ==========================
-- TABLA grupo
-- ==========================

DROP PROCEDURE IF EXISTS buscarGrupo$$
CREATE PROCEDURE buscarGrupo (_id INT)
BEGIN
    SELECT * FROM grupo WHERE id = _id;
END$$

DROP PROCEDURE IF EXISTS filtrarGrupo$$
CREATE PROCEDURE filtrarGrupo (
    _parametros VARCHAR(255),
    _pagina SMALLINT UNSIGNED,
    _cantRegs SMALLINT UNSIGNED
)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idCurso&idProfesor&fechaInicio&fechaFin&horario&aula&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM grupo WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsGrupo$$
CREATE PROCEDURE numRegsGrupo (_parametros VARCHAR(255))
BEGIN
    SELECT cadenaFiltro(_parametros, 'idCurso&idProfesor&fechaInicio&fechaFin&horario&aula&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id) FROM grupo WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevoGrupo$$
CREATE FUNCTION nuevoGrupo (
    _idCurso INT,
    _idProfesor VARCHAR(15),
    _fechaInicio VARCHAR(10),
    _fechaFin VARCHAR(10),
    _horario VARCHAR(100),
    _aula VARCHAR(50)
) RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM grupo WHERE idCurso = _idCurso AND idProfesor = _idProfesor AND fechaInicio = _fechaInicio AND fechaFin = _fechaFin AND horario = _horario AND aula = _aula;
    IF _cant = 0 THEN
        INSERT INTO grupo(idCurso, idProfesor, fechaInicio, fechaFin, horario, aula)
        VALUES (_idCurso, _idProfesor, _fechaInicio, _fechaFin, _horario, _aula);
        SET _cant = 0;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarGrupo$$
CREATE FUNCTION editarGrupo (
    _id INT,
    _idCurso INT,
    _idProfesor VARCHAR(15),
    _fechaInicio VARCHAR(10),
    _fechaFin VARCHAR(10),
    _horario VARCHAR(100),
    _aula VARCHAR(50)
) RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM grupo WHERE id = _id;
    IF _cant > 0 THEN
        UPDATE grupo SET idCurso = _idCurso, idProfesor = _idProfesor, fechaInicio = _fechaInicio, fechaFin = _fechaFin, horario = _horario, aula = _aula WHERE id = _id;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS eliminarGrupo$$
CREATE FUNCTION eliminarGrupo (_id INT)
RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _existeGrupo INT;
    DECLARE _resp INT DEFAULT 0;

    -- Verifica si existe el grupo
    SELECT COUNT(*) INTO _existeGrupo FROM grupo WHERE id = _id;

    IF _existeGrupo = 0 THEN
        SET _resp = 0; -- No existe el grupo
    ELSE
        -- Aquí podrías agregar lógica para verificar relaciones si las hubiera
        DELETE FROM grupo WHERE id = _id;
        SET _resp = 1; -- Eliminado correctamente
    END IF;

    RETURN _resp;
END$$

DELIMITER ;