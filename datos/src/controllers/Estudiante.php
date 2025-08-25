<?php 
    namespace App\controllers;

    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Container\ContainerInterface;
    use PDO;

    class Estudiante extends Persona {

        protected $container;
        private const ROL = 3; // Asumiendo que 2 es el rol para estudiante
        private const RECURSO = "Estudiante";

        public function __construct(ContainerInterface $container) {
            $this->container = $container; 
        }

        public function read(Request $request, Response $response, $args) {
            $sql = "SELECT * FROM estudiante";

            if (isset($args['id'])) {
                $sql .= " WHERE id = :id";
            }
            $sql .= " LIMIT 0,5;";

            $con = $this->container->get('base_datos');
            $query = $con->prepare($sql);

            if (isset($args["id"])) {
                $query->execute(["id" => $args["id"]]);
            } else {
                $query->execute();
            }

            $res = $query->fetchAll();
            $status = $query->rowCount() > 0 ? 200 : 204;

            $response->getBody()->write(json_encode($res));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($status);
        }

        public function create(Request $request, Response $response, $args) {
            $body = json_decode($request->getBody(), 1);
            $status = $this->createP(self::RECURSO, self::ROL, $body);
            return $response->withStatus($status);
        }

        public function update(Request $request, Response $response, $args) {
            $body = json_decode($request->getBody(), 1);
            $status = $this->updateP(self::RECURSO, $body, $args['id']);
            return $response->withStatus($status);
        }

        public function delete(Request $request, Response $response, $args) {
            $status = $this->deleteP(self::RECURSO, $args['id']);
            return $response->withStatus($status);
        }

        public function filtrar(Request $request, Response $response, $args){
            $campos = ['carnet', 'nombre', 'apellido1', 'apellido2', 'telefono', 'correo', 'direccion'];
            $datos = $request->getQueryParams();
            $resp = $this->filtrarP(self::RECURSO, $datos, $args['pag'], $args['lim']);
            $response->getBody()->write(json_encode($resp['datos']));
            return $response
                ->withHeader('Content-type', 'application/json')
                ->withStatus($resp['status']);
        }

        public function buscar(Request $request, Response $response, $args) {
            $id = $args['id'];
            $sql = "CALL buscarEstudiante($id);";

            $con =  $this->container->get('base_datos');
            $query = $con->prepare($sql);

            $query->execute();
            $res = $query->fetch(PDO::FETCH_ASSOC);
            $status = $query->rowCount() > 0 ? 200 : 204;

            $response->getbody()->write(json_encode($res));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($status);
        }
    }
