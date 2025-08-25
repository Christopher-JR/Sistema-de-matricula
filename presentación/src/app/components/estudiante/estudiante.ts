import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { TipoAlumno } from '../../shared/models/interfaces';
import { AlumnoService } from '../../shared/services/alumno-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FrmEstudiante } from '../forms/frm-estudiante/frm-estudiante';
import { Dial } from 'flowbite';
import { DialogoGeneral } from '../forms/dialogo-general/dialogo-general';
import { UsuarioService } from '../../shared/services/usuario-service';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/services/auth-service';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PrintService } from '../../shared/services/print-service';

@Component({
  selector: 'app-estudiante', 
  imports: [MatCardModule, MatTableModule, MatIconModule, MatExpansionModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, MatPaginatorModule], 
  templateUrl: './estudiante.html',
  styleUrl: './estudiante.css'
})
export class Estudiante implements AfterViewInit {
  private readonly estudianteSrv = inject(AlumnoService);
  private readonly usuarioSrv = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  public readonly srvAuth = inject(AuthService);
  private readonly printSrv = inject(PrintService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  panelOpenState = signal(false);

  columnas: string[] = ['idEstudiante', 'nombre', 'apellido1', 'apellido2', 'telefono', 'correo', 'botonera'];
  datos: any;

  dataSource = signal(new MatTableDataSource<TipoAlumno>());

  filtro : any;

  ngAfterViewInit(): void {
    this.filtro = { idEstudiante: '', nombre: '', apellido1: '', apelllido2: '' };
    this.filtrar();
  }
  
  resetFiltro() {
    this.filtro = { idEstudiante: '', nombre: '', apellido1: '', apelllido2: '' };
    this.filtrar();
  }
  
  filtrar() {
    this.estudianteSrv.filtrar(this.filtro) 
      .subscribe({
        next: (data: any) => {
          console.log(data) 
          this.dataSource.set(data);
        },
        error: (err) => console.log(err)
      })
  }

  // Limpia los campos de filtro
  limpiar(){
    this.resetFiltro();
    (document.querySelector('#fidEstudiante') as HTMLInputElement).value = '';
    (document.querySelector('#fnombre') as HTMLInputElement).value = '';
    (document.querySelector('#fapellido1') as HTMLInputElement).value = '';
    (document.querySelector('#fapellido2') as HTMLInputElement).value = '';
  }

  onNuevo() {
    this.mostrarDialogo("Nuevo Estudiante");
  }

  mostrarDialogo(titulo: string, datos?: TipoAlumno) {
    const dialogRef = this.dialog.open(FrmEstudiante,
      {
        width: '50vw', 
        maxHeight: '35rem', 
        data: {
          title: titulo,
          datos: datos
        },
        disableClose: true 
      }
    );
    dialogRef.afterClosed()
      .subscribe({
        next : (res) => {
          if (res != false) {
            this.resetFiltro();
          }
        },
        error: (err) => { console.log(err) }
      })
  }

  onEditar(id: number) {
    this.estudianteSrv.buscar(id)
    .subscribe({
      next : (data) => {
        this.mostrarDialogo('Editar Estudiante', data);
      }
    })
  }
  
  onEliminar(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar este estudiante?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no' 

      }
    });
    dialogRef.afterClosed().subscribe(resul => {
      if (resul === true) {
        this.estudianteSrv.eliminar(id)
          .subscribe((res: any) => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Estudiante eliminado correctamente',
                icono: 'check_circle',
                textoAceptar: 'Aceptar',
              }
            })
          })
      }
    })
  }

  onInfo(id: number) { }

  onFiltroChange(f : any) {
    this.filtro = f;
    this.filtrar();
  }

  onResetPassw(id: number) { 
    this.estudianteSrv.buscar(id)
    .subscribe({
      next : (data) => {
        const dialogRef = this.dialog.open(DialogoGeneral, {
          data: {
            texto: `'¿Resetear contraseña de ${data.nombre}?'`,
            icono: 'question_mark',
            textoAceptar: 'Si',
            textoCancelar: 'No' 
          }
        });
        dialogRef.afterClosed().subscribe(resul => {
          if (resul === true) {
            this.usuarioSrv.resetearPassw(data.idEstudiante)
            .subscribe(() => {
              this.dialog.open(DialogoGeneral, {
                data: {
                  texto: 'Contraseña restablecida correctamente',
                  icono: 'check',
                  textoAceptar: 'Aceptar',
                }
              })
            })
          }
        });
      }
    })
  }

  onImprimir() {
    const encabezado = [ 'Id Estudiante', 'Nombre', 'Teléfono', 'Correo', 'Fecha Ingreso' ];
    this.estudianteSrv.filtrar(this.filtro)
      .subscribe({
        next: (data) => {
          const cuerpo = 
          Object(data).map((Obj: any) => {
            const datos = [
              Obj.idEstudiante,
              `${Obj.nombre} ${Obj.apellido1} ${Obj.apellido2}`,
              Obj.telefono,
              Obj.correo,
              Obj.direccion,
              Obj.fechaIngreso
            ];
            return datos;
          });
          this.printSrv.print(encabezado, cuerpo, 'Listado de Estudiantes', false);
        },
        error: (err) => console.error(err)
      });
  }

  


}
