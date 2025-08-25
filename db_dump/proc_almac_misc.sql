USE ucr;
DELIMITER $$
DROP FUNCTION IF EXISTS cadenaFiltro$$
CREATE FUNCTION cadenaFiltro (
    _parametros VARCHAR(250),
    _campos VARCHAR(250)
) RETURNS VARCHAR(250)
BEGIN
    DECLARE _salida VARCHAR(250);
    SET @param = CONCAT(_parametros, '&');  -- Agrega '&' final
    SET @campos = CONCAT(_campos, '&');     -- Agrega '&' final
    SET @filtro = '';

    WHILE (LOCATE('&', @param) > 0) DO
        SET @valor = SUBSTRING_INDEX(@param, '&', 1);
        SET @param = SUBSTRING(@param, LOCATE('&', @param) + 1);
        SET @campo = SUBSTRING_INDEX(@campos, '&', 1);
        SET @campos = SUBSTRING(@campos, LOCATE('&', @campos) + 1);

        IF @valor != '' THEN
            SET @filtro = CONCAT(@filtro, ' `', @campo, "` LIKE '", @valor, "' AND");
        END IF;
    END WHILE;

    SET @filtro = TRIM(TRAILING 'AND' FROM @filtro);
    RETURN @filtro;
END$$
DELIMITER ;
