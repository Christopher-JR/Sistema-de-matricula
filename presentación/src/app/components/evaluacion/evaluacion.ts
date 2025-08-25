import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TipoEvaluacion} from '../../shared/models/interfaces';
import { EvaluacionService } from '../../shared/services/evaluacion-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FrmEvaluacion } from '../forms/frm-evaluacion/frm-evaluacion';
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
  selector: 'app-evaluacion', 
  imports: [MatCardModule, MatTableModule, MatIconModule, MatExpansionModule, MatPaginatorModule,
   MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule], 
  templateUrl: './evaluacion.html',
  styleUrl: './evaluacion.css'
})
export class Evaluacion implements AfterViewInit {
  private readonly evaluacionSrv = inject(EvaluacionService);
  private readonly dialog = inject(MatDialog);
  private readonly printSrv = inject(PrintService);
  public readonly srvAuth = inject(AuthService);


  panelOpenState = signal(false);

  columnas: string[] = ['idMatricula', 'nota', 'observaciones', 'fechaEvaluacion', 'botonera'];
  datos: any;

  dataSource = signal(new MatTableDataSource<TipoEvaluacion>());

  filtro : any;

  ngAfterViewInit(): void {
    this.filtro = { idMatricula: '', nota: '', observaciones: '', fechaEvaluacion: '' };
    this.filtrar();
  }
  
  resetFiltro() {
    this.filtro = { idMatricula: '', nota: '', observaciones: '', fechaEvaluacion: ''  };
    this.filtrar();
  }
  
  filtrar() {
    this.evaluacionSrv.filtrar(this.filtro) 
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
    (document.querySelector('#fidMatricula') as HTMLInputElement).value = '';
    (document.querySelector('#fnota') as HTMLInputElement).value = '';
    (document.querySelector('#fdateEvaluacion') as HTMLInputElement).value = '';
  }

  onNuevo() {
    this.mostrarDialogo("Nueva Evaluación");
  }

  mostrarDialogo(titulo: string, datos?: TipoEvaluacion) {
    const dialogRef = this.dialog.open(FrmEvaluacion,
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
    this.evaluacionSrv.buscar(id)
    .subscribe({
      next : (data) => {
        console.log(data, "datos");
        this.mostrarDialogo('Editar Evaluación', data);
      }
    })
  }
  
  onEliminar(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar esta evaluación?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no' 

      }
    });
    dialogRef.afterClosed().subscribe(resul => {
      if (resul === true) {
        this.evaluacionSrv.eliminar(id)
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
    const encabezado = [ 'Id Matrícula', 'Nota', 'Observaciones', 'Fecha Evaluación' ];
    this.evaluacionSrv.filtrar(this.filtro)
      .subscribe({
        next: (data) => {
          const cuerpo = 
          Object(data).map((Obj: any) => {
            const datos = [
              Obj.idMatricula,
              Obj.nota,
              Obj.observaciones,
              Obj.fechaEvaluacion
            ];
            return datos;
          });
          this.printSrv.print(encabezado, cuerpo, 'Listado de Evaluaciones', false);
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
