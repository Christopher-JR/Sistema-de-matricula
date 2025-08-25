USE ucr;
SET GLOBAL log_bin_trust_function_creators = 1;
DELIMITER $$

-- ==========================
-- TABLA evaluacion
-- ==========================

DROP PROCEDURE IF EXISTS buscarEvaluacion$$
CREATE PROCEDURE buscarEvaluacion (_id INT)
BEGIN
    SELECT * FROM evaluacion WHERE id = _id;
END$$

DROP PROCEDURE IF EXISTS filtrarEvaluacion$$
CREATE PROCEDURE filtrarEvaluacion (_parametros VARCHAR(255), _pagina SMALLINT UNSIGNED, _cantRegs SMALLINT UNSIGNED)
BEGIN
    SELECT cadenaFiltro(_parametros, 'idMatricula&nota&fechaEvaluacion&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM evaluacion WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsEvaluacion$$
CREATE PROCEDURE numRegsEvaluacion (_parametros VARCHAR(255))
BEGIN
    SELECT cadenaFiltro(_parametros, 'idMatricula&nota&fechaEvaluacion&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id) FROM evaluacion WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevaEvaluacion$$
CREATE FUNCTION nuevaEvaluacion (
    _idMatricula INT,
    _nota DECIMAL(5,2),
    _observaciones VARCHAR(255),
    _fechaEvaluacion varchar(10)
) RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM evaluacion WHERE idMatricula = _idMatricula AND fechaEvaluacion = _fechaEvaluacion;
    IF _cant = 0 THEN
        INSERT INTO evaluacion(idMatricula, nota, observaciones, fechaEvaluacion)
        VALUES (_idMatricula, _nota, _observaciones, _fechaEvaluacion);
        SET _cant = 0;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarEvaluacion$$
CREATE FUNCTION editarEvaluacion (
    _id INT,
    _idMatricula INT,
    _nota DECIMAL(5,2),
    _observaciones VARCHAR(255),
    _fechaEvaluacion varchar(10)
) RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM evaluacion WHERE id = _id;
    IF _cant > 0 THEN
        UPDATE evaluacion SET idMatricula = _idMatricula, nota = _nota, observaciones = _observaciones, fechaEvaluacion = _fechaEvaluacion WHERE id = _id;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS eliminarEvaluacion$$
CREATE FUNCTION eliminarEvaluacion (_id INT)
RETURNS INT(1)
READS SQL DATA
BEGIN
    DECLARE _existeEvaluacion INT;
    DECLARE _resp INT DEFAULT 0;

    SELECT COUNT(*) INTO _existeEvaluacion FROM evaluacion WHERE id = _id;

    IF _existeEvaluacion = 0 THEN
        SET _resp = 0; -- No existe la evaluación
    ELSE
        DELETE FROM evaluacion WHERE id = _id;
        SET _resp = 1; -- Eliminada correctamente
    END IF;

    RETURN _resp;
END$$

DELIMITER ;