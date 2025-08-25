<?php 
namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;
use PDOException;

class Grupo {

    protected $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container; 
    }

    public function read(Request $request, Response $response, $args) {
        $sql = "SELECT * FROM grupo";

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

        // Verifica si existe el curso
        $checkCurso = $con->prepare("SELECT COUNT(*) FROM curso WHERE id = :idCurso");
        $checkCurso->bindValue(':idCurso', $body->idCurso, PDO::PARAM_INT);
        $checkCurso->execute();
        $cursoExiste = $checkCurso->fetchColumn();

        // Verifica si existe el profesor
        $checkProfesor = $con->prepare("SELECT COUNT(*) FROM profesor WHERE idProfesor = :idProfesor");
        $checkProfesor->bindValue(':idProfesor', $body->idProfesor, PDO::PARAM_STR);
        $checkProfesor->execute();
        $profesorExiste = $checkProfesor->fetchColumn();

        if (!$cursoExiste || !$profesorExiste) {
            $con = null;
            return $response->withStatus(404); // Curso o profesor no encontrado
        }

        $sql = "SELECT nuevoGrupo(:idCurso, :idProfesor, :fechaInicio, :fechaFin, :horario, :aula);";
        $con->beginTransaction();
        $query = $con->prepare($sql);

        foreach($body as $key => $value){
            $TIPO = gettype($value) == "integer" ? PDO::PARAM_INT : PDO::PARAM_STR;
            $value = filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS);
            $query->bindValue(':' . $key, $value, $TIPO);
        }

        try {
            $query->execute();
            $con->commit();
            $resp = $query->fetch(PDO::FETCH_NUM)[0];
            $status = match($resp){
                0 => 201,
                1 => 409,
                2 => 428
            };
        } catch(PDOException $e) {
            $status = 500;
            $con->rollback();
        }

        $query = null;
        $con = null;

        return $response->withStatus($status);
    }
    
    public function update(Request $request, Response $response, $args) {
        $body = json_decode($request->getBody());
        $id = $args["id"];

        if(isset($body->id)){
            unset($body->id);
        }

        $con = $this->container->get('base_datos');

        // Verifica si existe el curso
        $checkCurso = $con->prepare("SELECT COUNT(*) FROM curso WHERE id = :idCurso");
        $checkCurso->bindValue(':idCurso', $body->idCurso, PDO::PARAM_INT);
        $checkCurso->execute();
        $cursoExiste = $checkCurso->fetchColumn();

        // Verifica si existe el profesor
        $checkProfesor = $con->prepare("SELECT COUNT(*) FROM profesor WHERE idProfesor = :idProfesor");
        $checkProfesor->bindValue(':idProfesor', $body->idProfesor, PDO::PARAM_STR);
        $checkProfesor->execute();
        $profesorExiste = $checkProfesor->fetchColumn();

        if (!$cursoExiste || !$profesorExiste) {
            $con = null;
            return $response->withStatus(404); // Curso o profesor no encontrado
        }

        $sql = "SELECT editarGrupo(:id, :idCurso, :idProfesor, :fechaInicio, :fechaFin, :horario, :aula);";
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
        $sql =  "SELECT eliminarGrupo(:id);";
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
          
        $campos = ['idCurso', 'idProfesor', 'fechaInicio', 'fechaFin', 'horario', 'aula'];
        $datos = $request->getQueryParams();
        $filtro = '';
        foreach ($campos as $campo) {
            $valor = isset($datos[$campo]) ? $datos[$campo] : '';
            $filtro .= '%' . $valor . '%&';
        }
        $filtro = rtrim($filtro, '&');
        $sql = "CALL filtrarGrupo('$filtro', {$args['pag']}, {$args['lim']});";
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
        $sql = "CALL buscarGrupo($id);";

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