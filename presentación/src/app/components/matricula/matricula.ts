import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TipoMatricula} from '../../shared/models/interfaces';
import { MatriculaService } from '../../shared/services/matricula-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FrmMatricula } from '../forms/frm-matricula/frm-matricula';
import { DialogoGeneral } from '../forms/dialogo-general/dialogo-general';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PrintService } from '../../shared/services/print-service';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-matricula', 
  imports: [MatCardModule, MatTableModule, MatIconModule, MatExpansionModule, MatPaginatorModule,
   MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule], 
  templateUrl: './matricula.html',
  styleUrl: './matricula.css'
})
export class Matricula implements AfterViewInit {
  private readonly matriculaSrv = inject(MatriculaService);
  private readonly dialog = inject(MatDialog);
  private readonly printSrv = inject(PrintService);

  public readonly srvAuth = inject(AuthService);

  panelOpenState = signal(false);

  columnas: string[] = ['idEstudiante', 'idGrupo', 'fechaMatricula', 'estado', 'botonera'];
  datos: any;

  dataSource = signal(new MatTableDataSource<TipoMatricula>());

  filtro : any;

  ngAfterViewInit(): void {
    this.filtro = { idEstudiante: '', idGrupo: '', fechaMatricula: '', estado: '' };
    this.filtrar();
  }
  
  resetFiltro() {
    this.filtro = { idEstudiante: '', idGrupo: '', fechaMatricula: '', estado: '' };
    this.filtrar();
  }
  
  filtrar() {
    this.matriculaSrv.filtrar(this.filtro) 
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
    (document.querySelector('#fdateMatricula') as HTMLInputElement).value = '';
    (document.querySelector('#festado') as HTMLInputElement).value = '';
  }

  onNuevo() {
    this.mostrarDialogo("Nueva Matrícula");
  }

  mostrarDialogo(titulo: string, datos?: TipoMatricula) {
    const dialogRef = this.dialog.open(FrmMatricula,
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
    this.matriculaSrv.buscar(id)
    .subscribe({
      next : (data) => {
        console.log(data, "datos");
        this.mostrarDialogo('Editar Matrícula', data);
      }
    })
  }
  
  onEliminar(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar esta matrícula?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no' 

      }
    });
    dialogRef.afterClosed().subscribe(resul => {
      if (resul === true) {
        this.matriculaSrv.eliminar(id)
          .subscribe((res: any) => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Evaluación eliminada correctamente',
                icono: 'check_circle',
                textoAceptar: 'Aceptar',
              }
            })
          })
      }
    })
  }

  onImprimir() {
    const encabezado = [ 'Id Estudiante', 'Id Grupo', 'Fecha Matrícula', 'Estado' ];
    this.matriculaSrv.filtrar(this.filtro)
      .subscribe({
        next: (data) => {
          const cuerpo = 
          Object(data).map((Obj: any) => {
            const datos = [
              Obj.idEstudiante,
              Obj.idGrupo,
              Obj.fechaMatricula,
              Obj.estado
            ];
            return datos;
          });
          this.printSrv.print(encabezado, cuerpo, 'Listado de Matrículas', false);
        },
        error: (err) => console.error(err)
      });
  }

  onInfo(id: number) { }

  onFiltroChange(f : any) {
    this.filtro = f;
    this.filtrar();
  }

}
