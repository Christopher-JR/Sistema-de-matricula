<?php 
    namespace App\controllers;
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Container\ContainerInterface;

    class Auth extends ServicioCURL {

        protected $container;
        private const ENDPOINT = "/auth";

        public function __construct(ContainerInterface $container) {
            $this->container = $container; 
        }

        public function iniciar(Request $request, Response $response, $args) {
            // El body de la solicitud ya viene como string JSON, simplemente lo pasamos
            $body = (string)$request->getBody(); 
            
            // Llama a ejecutarCURL con el método PATCH y el cuerpo de la solicitud
            $respA = $this->ejecutarCURL(self::ENDPOINT, 'PATCH', $body);
            
            // Retorna la respuesta y el estado de la capa de datos
            $response->getBody()->write($respA['resp']);
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($respA['status']);
        }

        public function refrescar(Request $request, Response $response, $args) {
            // El body de la solicitud ya viene como string JSON
            $body = (string)$request->getBody(); 

            // Llama a ejecutarCURL con el método PATCH al endpoint de refrescar
            $respA = $this->ejecutarCURL(self::ENDPOINT . '/refrescar', 'PATCH', $body);
            
            // Retorna la respuesta y el estado de la capa de datos
            $response->getBody()->write($respA['resp']);
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($respA['status']);
        }

        public function cerrar(Request $request, Response $response, $args) {
            $idUsuario = $args['idUsuario'];
            
            // Llama a ejecutarCURL con el método DELETE
            $respA = $this->ejecutarCURL(self::ENDPOINT . "/{$idUsuario}", 'DELETE');
            
            // Retorna solo el estado de la capa de datos
            return $response->withStatus($respA['status']);
        }
        
    }
