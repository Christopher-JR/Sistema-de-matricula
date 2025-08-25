<?php
    // Configuracion para poder hacer la conxeión a la BD
    // Dentro del container Inyección de dependencias     ventas
    $container->set('config_bd', function(){
        return(object) [
            "host" => $_ENV['DB_HOST'],
            "db" => $_ENV['DB_NAME'],
            "user" => $_ENV['DB_USER'],
            "passw" => $_ENV['DB_PASSW'],
            "charset" => "utf8mb4"
        ];
    });
    $container->set('key', function(){
        return $_ENV["KEY"];
    });