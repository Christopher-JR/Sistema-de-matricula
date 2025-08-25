USE ucr;
SET GLOBAL log_bin_trust_function_creators = 1;
DELIMITER $$

-- ==========================
-- TABLA curso
-- ==========================
DROP PROCEDURE IF EXISTS buscarCurso$$
CREATE PROCEDURE buscarCurso (_id INT)
BEGIN
    SELECT * FROM curso WHERE id = _id;
END$$

DROP PROCEDURE IF EXISTS filtrarCurso$$
CREATE PROCEDURE filtrarCurso (_parametros VARCHAR(100), _pagina SMALLINT UNSIGNED, _cantRegs SMALLINT UNSIGNED)
BEGIN
    SELECT cadenaFiltro(_parametros, 'codigo&nombre&') INTO @filtro;
    SELECT CONCAT("SELECT * FROM curso WHERE ", @filtro, " LIMIT ", _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS numRegsCurso$$
CREATE PROCEDURE numRegsCurso (_parametros VARCHAR(100))
BEGIN
    SELECT cadenaFiltro(_parametros, 'codigo&nombre&') INTO @filtro;
    SELECT CONCAT("SELECT COUNT(id) FROM curso WHERE ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END$$

DROP FUNCTION IF EXISTS nuevoCurso$$
CREATE FUNCTION nuevoCurso (_codigo VARCHAR(15), _nombre VARCHAR(50), _descripcion VARCHAR(255), _duracion INT, _cupoMaximo INT)
RETURNS INT(1)
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM curso WHERE codigo = _codigo;
    IF _cant = 0 THEN
        INSERT INTO curso(codigo, nombre, descripcion, duracion, cupoMaximo)
        VALUES (_codigo, _nombre, _descripcion, _duracion, _cupoMaximo);
        SET _cant = 0;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS editarCurso$$
CREATE FUNCTION editarCurso (_id INT, _codigo VARCHAR(15), _nombre VARCHAR(50), _descripcion VARCHAR(255), _duracion INT, _cupoMaximo INT)
RETURNS INT(1)
BEGIN
    DECLARE _cant INT;
    SELECT COUNT(*) INTO _cant FROM curso WHERE id = _id;
    IF _cant > 0 THEN
        UPDATE curso SET codigo = _codigo, nombre = _nombre, descripcion = _descripcion, duracion = _duracion, cupoMaximo = _cupoMaximo WHERE id = _id;
    END IF;
    RETURN _cant;
END$$

DROP FUNCTION IF EXISTS eliminarCurso$$
CREATE FUNCTION eliminarCurso (_id INT)
RETURNS INT(1)
BEGIN
    DECLARE _cantGrupos INT;
    DECLARE _existeCurso INT;
    DECLARE _resp INT DEFAULT 0;

    -- Verifica si existe el curso
    SELECT COUNT(*) INTO _existeCurso FROM curso WHERE id = _id;

    IF _existeCurso = 0 THEN
        SET _resp = 0; -- No existe el curso
    ELSE
        -- Verifica si tiene grupos asociados
        SELECT COUNT(*) INTO _cantGrupos FROM grupo WHERE idCurso = _id;

        IF _cantGrupos = 0 THEN
            DELETE FROM curso WHERE id = _id;
            SET _resp = 1; -- Eliminado correctamente
        ELSE
            SET _resp = 2; -- Tiene relaciones
        END IF;
    END IF;

    RETURN _resp;
END$$

DELIMITER ;