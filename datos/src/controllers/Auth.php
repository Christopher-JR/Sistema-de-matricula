<?php 
    namespace App\controllers;
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Container\ContainerInterface;
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;
    Use PDO;

    class Auth extends Autenticar {
        
        // Verifica o modifica el token de refresco del usuario o verifica su existencia
        private function accederToken(string $proc, string $idUsuario, $tkRef = "") {
            $sql = $proc === "modificar" ? "SELECT modificarToken " : "CALL verificarTokenR ";
            $sql .= "(:idUsuario, :tkRef);";

            $con = $this->container->get('base_datos');
            $query = $con->prepare($sql);
            $query->execute(['idUsuario' => $idUsuario, 'tkRef' => $tkRef]);

            $datos = $proc === "modificar" ? $query->fetch(PDO::FETCH_NUM) : $query->fetchColumn();
            $query = null;
            $con = null;
            return $datos;

        }

        // Actualiza el token de refresco del usuario
        private function modificarToken(string $idUsuario, string $tkRef = "") {
            return $this->accederToken("modificar", $idUsuario, $tkRef);
        }

        // Verifica el token de refresco del usuario en BD
        private function verificarToken(string $idUsuario, string $tkRef) {
            return $this->accederToken("verificar", $idUsuario, $tkRef);
        }

        // Genera el token de acceso y el token de refresco
        private function generarToken(string $idUsuario, int $rol, string $nombre) {
            $key = $this->container->get('key'); //Esta clave esta en config.php
            $payload = [
                'iss' => $_SERVER['SERVER_NAME'],
                'iat' => time(),
                'exp' => time() + 300, 
                'sub' => $idUsuario,
                'rol' => $rol,
                'nom' => $nombre
            ];
            $payloadRef = [
                'iss' => $_SERVER['SERVER_NAME'],
                'iat' => time(),
                'rol' => $rol,
                'nom' => $nombre
            ];

            return [
                "token" => JWT::encode($payload, $key, 'HS256'),
                "tkRef" => JWT::encode($payloadRef, $key, 'HS256'),
            ];
        }

        //Inicia la sesion de un usuario (se envia el idUsuario y la passw) 
        public function iniciar(Request $request, Response $response, $args) {
            $body = json_decode($request->getBody());
            if($datos = $this->autenticar($body->idUsuario, $body->passw)){
                $tokens = $this->generarToken($body->idUsuario, $datos['rol'], $datos['nombre']);
                $this->modificarToken(idUsuario: $body->idUsuario, tkRef: $tokens['tkRef']);
                $response->getBody()->write(json_encode($tokens));
                $status = 200; 
            } else {
                $status = 401; // Unauthorized
            }
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($status);
        }

        // Cierra la sesion de un usuario eliminando el token (se envia el idUsuario)
        public function cerrar(Request $request, Response $response, $args) {
            $this->modificarToken(idUsuario: $args['idUsuario']);
            return $response->withStatus(200);
        }

        // Refresca el token de la sesion activa (Se envia el idUsuario y el tkRef)
        public function refrescar(Request $request, Response $response, $args) {
            $body = json_decode($request->getBody());
            $rol = $this->verificarToken($body->idUsuario, $body->tkRef);
            $status = 200;
            if($rol){
                $datos = JWT::decode($body->tkRef, new Key($this->container->get('key'), 'HS256'));
                $tokens = $this->generarToken($body->idUsuario, $datos->rol, $datos->nom);
                $this->modificarToken(idUsuario: $body->idUsuario, tkRef: $tokens['tkRef']);
                $response->getBody()->write(json_encode($tokens));
            } else {
                $status = 401; 
            }
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($status);
        }
    }