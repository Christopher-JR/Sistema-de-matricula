import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Page404 } from './components/page404/page404';
import { Login } from './components/login/login';
import { Estudiante } from './components/estudiante/estudiante';
import { Profesor } from './components/profesor/profesor';
import { Administrador } from './components/administrador/administrador';
import { Grupo } from './components/grupo/grupo';
import { Evaluacion } from './components/evaluacion/evaluacion';
import { Matricula } from './components/matricula/matricula';
import { Curso } from './components/curso/curso';
import { Role } from './shared/models/role';
import { authGuard } from './shared/helpers/guards/auth-guard';
import { loginGuard } from './shared/helpers/guards/login-guard';
 
export const routes: Routes = [

    {path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'home',component : Home },
    {path: 'curso', component: Curso},

    {path: 'estudiante', component: Estudiante,
        canActivate: [authGuard],
        data: [Role.Administrador, Role.Profesor]
    },

    {path: 'profesor', component: Profesor},
    {path: 'administrador', component: Administrador},
    {path: 'grupo', component: Grupo},
    {path: 'evaluacion', component: Evaluacion/*,
        canActivate: [authGuard],
        data: [Role.Administrador, Role.Profesor]*/
    },
    {path: 'matricula', component: Matricula},

    {path: 'login',component: Login/*, canActivate: [loginGuard]*/},
    
    {path: '**', component:Page404 }
];

