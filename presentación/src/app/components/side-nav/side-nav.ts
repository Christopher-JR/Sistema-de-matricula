import { Component, inject, signal } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';

type MenuItem = {
  icon: string;
  label: string;
  route: string;
  rol: number[]
}

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule,MatListModule,RouterModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css'
})
export class SideNav {
  srvAuth = inject(AuthService);

  menuItem = signal<MenuItem[]>([ 
    {  
      icon : 'home', 
      label: 'Inicio',
      route: 'home',
      rol: [1, 2, 3]
    },
    {
      icon : 'sticky_note_2', 
      label: 'Cursos',
      route: 'curso',
      rol: [1, 2, 3]
    },
    {
      icon : 'group', 
      label: 'Estudiantes',
      route: 'estudiante',
      rol: [1, 2, 3]
    },
    { 
      icon : 'co_present', 
      label: 'Profesores',
      route: 'profesor',
      rol: [1, 2]
    },
    {
      icon : 'manage_accounts', 
      label: 'Administradores',
      route: 'administrador',
      rol: [1]
    },
    {
      icon : 'groups', 
      label: 'Grupos',
      route: 'grupo',
      rol: [1, 2, 3]
    },
    
    {
      icon : 'edit_square', 
      label: 'Matrículas',
      route: 'matricula',
      rol: [1, 2, 3]
    },
    {
      icon : 'credit_score', 
      label: 'Evaluaciones',
      route: 'evaluacion',
      rol: [1, 2, 3]
    }
  ])
}
