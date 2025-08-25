<?php
   namespace App\controllers;
   use Psr\Http\Message\ResponseInterface as Response;
   use Psr\Http\Message\ServerRequestInterface as Request;
   use Psr\Container\ContainerInterface;
   use Slim\Routing\RouteCollectorProxy;


   $app->group('/api',function(RouteCollectorProxy $api){
      
      $api->group('/curso', function(RouteCollectorProxy $curso){
         $curso->get('/read[/{id}]', Curso::class . ':read');
         $curso->get('/buscar/{id}', Curso::class . ':buscar');
         $curso->post('', Curso::class . ':create');
         $curso->put('/{id}', Curso::class . ':update');
         $curso->delete('/{id}', Curso::class . ':delete');
         $curso->get('/filtrar/{pag}/{lim}', Curso::class . ':filtrar');
      });

      $api->group('/estudiante', function(RouteCollectorProxy $estudiante){
         $estudiante->get('/read[/{id}]', Estudiante::class . ':read');
         $estudiante->get('/buscar/{id}', Estudiante::class . ':buscar');
         $estudiante->post('', Estudiante::class . ':create');
         $estudiante->put('/{id}', Estudiante::class . ':update');
         $estudiante->delete('/{id}', Estudiante::class . ':delete');
         $estudiante->get('/filtrar/{pag}/{lim}', Estudiante::class . ':filtrar');
      });

      $api->group('/profesor', function(RouteCollectorProxy $profesor){
         $profesor->get('/read[/{id}]', Profesor::class . ':read');
         $profesor->get('/buscar/{id}', Profesor::class . ':buscar');
         $profesor->post('', Profesor::class . ':create');
         $profesor->put('/{id}', Profesor::class . ':update');
         $profesor->delete('/{id}', Profesor::class . ':delete');
         $profesor->get('/filtrar/{pag}/{lim}', Profesor::class . ':filtrar');
      });

      $api->group('/admin', function(RouteCollectorProxy $admin){
         $admin->get('/read[/{id}]', Administrador::class . ':read');
         $admin->get('/buscar/{id}', Administrador::class . ':buscar');
         $admin->post('', Administrador::class . ':create');
         $admin->put('/{id}', Administrador::class . ':update');
         $admin->delete('/{id}', Administrador::class . ':delete');
         $admin->get('/filtrar/{pag}/{lim}', Administrador::class . ':filtrar');
      });

      $api->group('/grupo', function(RouteCollectorProxy $grupo){
         $grupo->get('/read[/{id}]', Grupo::class . ':read');
         $grupo->get('/buscar/{id}', Grupo::class . ':buscar');
         $grupo->post('', Grupo::class . ':create');
         $grupo->put('/{id}', Grupo::class . ':update');
         $grupo->delete('/{id}', Grupo::class . ':delete');
         $grupo->get('/filtrar/{pag}/{lim}', Grupo::class . ':filtrar');
      });

      $api->group('/matricula', function(RouteCollectorProxy $matricula){
         $matricula->get('/read[/{id}]', Matricula::class . ':read');
         $matricula->get('/buscar/{id}', Matricula::class . ':buscar');
         $matricula->post('', Matricula::class . ':create');
         $matricula->put('/{id}', Matricula::class . ':update');
         $matricula->delete('/{id}', Matricula::class . ':delete');
         $matricula->get('/filtrar/{pag}/{lim}', Matricula::class . ':filtrar');
      });

      $api->group('/evaluacion', function(RouteCollectorProxy $evaluacion){
         $evaluacion->get('/read[/{id}]', Evaluacion::class . ':read');
         $evaluacion->get('/buscar/{id}', Evaluacion::class . ':buscar');
         $evaluacion->post('', Evaluacion::class . ':create');
         $evaluacion->put('/{id}', Evaluacion::class . ':update');
         $evaluacion->delete('/{id}', Evaluacion::class . ':delete');
         $evaluacion->get('/filtrar/{pag}/{lim}', Evaluacion::class . ':filtrar');
      });
      
      $api->group('/auth', function(RouteCollectorProxy $endpoint){
         $endpoint->patch('', Auth::class . ':iniciar');
         $endpoint->patch('/refrescar', Auth::class . ':refrescar');
         $endpoint->delete('/{idUsuario}', Auth::class . ':cerrar');
      });

      $api->group('/usr', function(RouteCollectorProxy $usuario){
         $usuario->patch('/reset/{idUsuario}', Usuario::class . ':resetPassw');
         $usuario->patch('/change/{idUsuario}', Usuario::class . ':changePassw');
         $usuario->patch('/rol/{idUsuario}', Usuario::class . ':changeRol');
      });

      
   });
