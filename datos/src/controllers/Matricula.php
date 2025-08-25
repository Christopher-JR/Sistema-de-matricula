<?php 
namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;
use PDOException;

class Matricula {

    protected $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container; 
    }

    public function read(Request $request, Response $response, $args) {
        $sql = "SELECT * FROM matricula";

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
        $body = json_decode($request->getBody());
        $con = $this->container->get('base_datos');

        // Verifica si existe el carnet
        $checkCarnet = $con->prepare("SELECT COUNT(*) FROM estudiante WHERE idEstudiante = :idEstudiante");
        $checkCarnet->bindValue(':idEstudiante', $body->idEstudiante, PDO::PARAM_STR);
        $checkCarnet->execute();
        $carnetExiste = $checkCarnet->fetchColumn();

        // Verifica si existe el grupo
        $checkGrupo = $con->prepare("SELECT COUNT(*) FROM grupo WHERE id = :idGrupo");
        $checkGrupo->bindValue(':idGrupo', $body->idGrupo, PDO::PARAM_INT);
        $checkGrupo->execute();
        $grupoExiste = $checkGrupo->fetchColumn();

        if (!$carnetExiste || !$grupoExiste) {
            $con = null;
            return $response->withStatus(404); // Carnet o grupo no encontrado
        }

        // Verifica si el grupo tiene cupo disponible para nuevas matrículas
        // Obtener el idCurso del grupo
        $stmt = $con->prepare("SELECT idCurso FROM grupo WHERE id = :idGrupo");
        $stmt->bindValue(':idGrupo', $body->idGrupo, PDO::PARAM_INT);
        $stmt->execute();
        $idCurso = $stmt->fetchColumn();

        // Obtener el cupo máximo del curso
        $stmt = $con->prepare("SELECT cupoMaximo FROM curso WHERE id = :idCurso");
        $stmt->bindValue(':idCurso', $idCurso, PDO::PARAM_INT);
        $stmt->execute();
        $cupoMaximo = $stmt->fetchColumn();

        // Contar matrículas activas en el grupo
        $stmt = $con->prepare("SELECT COUNT(*) FROM matricula WHERE idGrupo = :idGrupo AND estado = 'Activa'");
        $stmt->bindValue(':idGrupo', $body->idGrupo, PDO::PARAM_INT);
        $stmt->execute();
        $matriculasActuales = $stmt->fetchColumn();

        if ($matriculasActuales >= $cupoMaximo) {
            $con = null;
            return $response->withStatus(409); // Cupo lleno
        }

        $sql = "SELECT nuevaMatricula(:idEstudiante, :idGrupo, :fechaMatricula, :estado);";
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
        } catch(PDOException $e) {
            $status = 500;
            $con->rollback();
            $response->getBody()->write(json_encode(["error" => $e->getMessage()]));
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

        $con = $this->container->get('base_datos');

        // Verifica si existe el carnet
        $checkCarnet = $con->prepare("SELECT COUNT(*) FROM estudiante WHERE idEstudiante = :idEstudiante");
        $checkCarnet->bindValue(':idEstudiante', $body->idEstudiante, PDO::PARAM_STR);
        $checkCarnet->execute();
        $carnetExiste = $checkCarnet->fetchColumn();

        // Verifica si existe el grupo
        $checkGrupo = $con->prepare("SELECT COUNT(*) FROM grupo WHERE id = :idGrupo");
        $checkGrupo->bindValue(':idGrupo', $body->idGrupo, PDO::PARAM_INT);
        $checkGrupo->execute();
        $grupoExiste = $checkGrupo->fetchColumn();

        if (!$carnetExiste || !$grupoExiste) {
            $con = null;
            return $response->withStatus(404); // Carnet o grupo no encontrado
        }

        $sql = "SELECT editarMatricula(:id, :idEstudiante, :idGrupo, :fechaMatricula, :estado);";
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
            $response->getBody()->write(json_encode(["error" => $e->getMessage()]));
        }

        $query = null;
        $con = null;

        return $response->withStatus($status);
    }

    public function delete(Request $request, Response $response, $args) {
        $sql =  "SELECT eliminarMatricula(:id);";
        $con = $this->container->get('base_datos');

        try {
            $query = $con->prepare($sql);
            $query->bindValue(":id", $args["id"], PDO::PARAM_INT);
            $query->execute();
            $resp = $query->fetch(PDO::FETCH_NUM)[0];

            $status = match($resp) {
                0 => 404, // No existe la matrícula
                1 => 200, // Eliminada correctamente
                2 => 409, // Tiene relaciones (conflicto)
                default => 500
            };
        } catch (PDOException $e) {
            // Si ocurre una violación de integridad referencial
            $status = $e->getCode() == 23000 ? 409 : 500;
        }

        $query = null; 
        $con = null; 

        return $response->withStatus($status);
    }

    public function filtrar(Request $request, Response $response, $args){
          
        $campos = ['idEstudiante', 'idGrupo', 'fechaMatricula', 'estado'];
        $datos = $request->getQueryParams();
        $filtro = '';
        foreach ($campos as $campo) {
            $valor = isset($datos[$campo]) ? $datos[$campo] : '';
            $filtro .= '%' . $valor . '%&';
        }
        $filtro = rtrim($filtro, '&');
        $sql = "CALL filtrarMatricula('$filtro', {$args['pag']}, {$args['lim']});";
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
            $sql = "CALL buscarMatricula($id);";

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