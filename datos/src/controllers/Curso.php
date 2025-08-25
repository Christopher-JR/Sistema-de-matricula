<?php 
    namespace App\controllers;

    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Container\ContainerInterface;
    use PDO;
    use PDOException;

    class Curso {

        protected $container;

        public function __construct(ContainerInterface $container) {
            $this->container = $container; 
        }

        public function read(Request $request, Response $response, $args) {
            $sql = "SELECT * FROM curso";

            if(isset($args['id'])){
                $sql .= " where id = :id";
            }
            $sql .= " limit 0,5;";

            $con = $this->container->get('base_datos');
            $query = $con->prepare($sql);

            if(isset($args["id"])){
                $query->execute(["id"=>$args["id"]]);
            } else {
                $query->execute();
            }

            $res = $query->fetchAll();
            $status= $query->rowCount() > 0 ? 200 : 204 ;

            $response->getBody()->write(json_encode($res));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($status);
        }

        public function create(Request $request, Response $response, $args) {
            
            $body= json_decode($request->getBody());

            $sql = "SELECT nuevoCurso(:codigo, :nombre, :descripcion, :duracion, :cupoMaximo);";
            $con=  $this->container->get('base_datos');

            $con->beginTransaction();

            $query = $con->prepare($sql);

            foreach($body as $key => $value){
                $TIPO= gettype($value)=="integer" ? PDO::PARAM_INT : PDO::PARAM_STR;

                $value=filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS);

                $query->bindValue(':' . $key, $value, $TIPO);
            };

            try{
                $query->execute();
                $con->commit();
                $resp= $query->fetch(PDO::FETCH_NUM)[0];
                $status = match($resp){
                    0 => 201,
                    1 => 409,
                    2 => 428
                };
            
            } catch(PDOException $e){
                $status = 500;
                $con->rollback();
            }
        
            $query=null;
            $con=null;


            return $response ->withStatus($status);
        }
        
        public function update(Request $request, Response $response, $args) {
            $body = json_decode($request->getBody());
            $id = $args["id"];

            if(isset($body->id)){
                unset($body->id);
            }

            $sql = "SELECT editarCurso(:id, :codigo, :nombre, :descripcion, :duracion, :cupoMaximo);";
            $con = $this->container->get('base_datos');
            $con->beginTransaction();

            $query = $con->prepare($sql);

            $query->bindValue(':id', $id, PDO::PARAM_INT);
            foreach($body as $key => $value){
                $TIPO = gettype($value) == "integer" ? PDO::PARAM_INT : PDO::PARAM_STR;
                $value = filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS);
                $query->bindValue(':' . $key, $value, $TIPO);
            }

            try{
                $query->execute();
                $con->commit();
                $resp = $query->fetch(PDO::FETCH_NUM)[0];
                $status = match($resp){
                    0 => 404,
                    1 => 200
                };
            }catch(PDOException $e){
                $status = 500;
                $con->rollback();
            }

            $query = null;
            $con = null;

            return $response->withStatus($status);
        }

        public function delete(Request $request, Response $response, $args) {
            $sql =  "SELECT eliminarCurso(:id);";
            $con = $this->container->get('base_datos');

            $query = $con->prepare($sql);
            $query->bindValue(":id", $args["id"], PDO::PARAM_INT);
            $query->execute();
            $resp = $query->fetch(PDO::FETCH_NUM)[0];

            $status = match($resp) {
                0 => 404, // No existe el curso
                1 => 200, // Eliminado correctamente
                2 => 409, // Tiene relaciones (conflicto)
                default => 500
            };

            $query = null; 
            $con = null; 

            return $response->withStatus($status);
        }

        public function filtrar(Request $request, Response $response, $args){
            
            $campos = [ 'codigo', 'nombre'];
            $datos = $request->getQueryParams();
            $filtro = '';
            foreach ($campos as $campo) {
                $valor = isset($datos[$campo]) ? $datos[$campo] : '';
                $filtro .= '%' . $valor . '%&';
            }
            $filtro = rtrim($filtro, '&');
            $sql = "CALL filtrarCurso('$filtro', {$args['pag']}, {$args['lim']});";
            $con = $this->container->get('base_datos');
            $query = $con->prepare($sql);
            $query->execute();
            $res = $query->fetchAll();

            $status = $query->rowCount() > 0 ? 200 : 204;

            $query = null;
            $con = null;

            $response->getbody()->write(json_encode($res));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($status);
        }

        public function buscar(Request $request, Response $response, $args) {
            $id = $args['id'];
            $sql = "CALL buscarCurso($id);";

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
    