<?php 
    namespace App\controllers;
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Container\ContainerInterface;

    class Usuario extends ServicioCURL {

        protected $container;
        private const ENDPOINT = "/usr";

        public function __construct(ContainerInterface $container) {
            $this->container = $container; 
        }

        public function changePassw(Request $request, Response $response, $args) {
            
            $idUsuario = $args['idUsuario'];
            $body = (string)$request->getBody(); 
            
            $respA = $this->ejecutarCURL(self::ENDPOINT . "/change/{$idUsuario}", 'PATCH', $body);
            
            $response->getBody()->write($respA['resp']);
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($respA['status']);
        }

        public function resetPassw(Request $request, Response $response, $args) {
            
            $idUsuario = $args['idUsuario'];
            
            $respA = $this->ejecutarCURL(self::ENDPOINT . "/reset/{$idUsuario}", 'PATCH', null); // No se envía body según tu implementacion de capa de datos
            
            $response->getBody()->write($respA['resp']);
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($respA['status']);
        }

        public function changeRol(Request $request, Response $response, $args) {

            $idUsuario = $args['idUsuario'];
            $body = (string)$request->getBody(); 

            $respA = $this->ejecutarCURL(self::ENDPOINT . "/rol/{$idUsuario}", 'PATCH', $body);
            
            $response->getBody()->write($respA['resp']);
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($respA['status']);
        }
        
    }
