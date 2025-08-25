import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TipoCurso} from '../../shared/models/interfaces';
import { CursoService } from '../../shared/services/curso-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FrmCurso } from '../forms/frm-curso/frm-curso';
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
  selector: 'app-curso', 
  imports: [MatCardModule, MatTableModule, MatIconModule, MatExpansionModule, MatPaginatorModule,
   MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule], 
  templateUrl: './curso.html',
  styleUrl: './curso.css'
})
export class Curso implements AfterViewInit {
  private readonly cursoSrv = inject(CursoService);
  private readonly dialog = inject(MatDialog);
  private readonly printSrv = inject(PrintService);

  public readonly srvAuth = inject(AuthService);

  panelOpenState = signal(false);

  columnas: string[] = ['codigo', 'nombre', 'duracion', 'cupoMaximo', 'botonera'];
  datos: any;

  dataSource = signal(new MatTableDataSource<TipoCurso>());

  filtro : any;

  ngAfterViewInit(): void {
    this.filtro = { idCurso: '', codigo: '', nombre: '', duracion: '' };
    this.filtrar();
  }
  
  resetFiltro() {
    this.filtro = { idCurso: '', codigo: '', nombre: '', duracion: '' };
    this.filtrar();
  }
  
  filtrar() {
    this.cursoSrv.filtrar(this.filtro) 
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
    (document.querySelector('#fcodigo') as HTMLInputElement).value = '';
    (document.querySelector('#fnombre') as HTMLInputElement).value = '';
  }

  onNuevo() {
    this.mostrarDialogo("Nuevo Curso");
  }

  mostrarDialogo(titulo: string, datos?: TipoCurso) {
    const dialogRef = this.dialog.open(FrmCurso,
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
    this.cursoSrv.buscar(id)
    .subscribe({
      next : (data) => {
        console.log(data, "datos");
        this.mostrarDialogo('Editar Curso', data);
      }
    })
  }
  
  onEliminar(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar este curso?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no' 

      }
    });
    dialogRef.afterClosed().subscribe(resul => {
      if (resul === true) {
        this.cursoSrv.eliminar(id)
          .subscribe((res: any) => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Curso eliminado correctamente',
                icono: 'check_circle',
                textoAceptar: 'Aceptar',
              }
            })
          })
      }
    })
  }

  onImprimir() {
    const encabezado = [ 'Código', 'Nombre', 'Duración', 'Cupo Máximo' ];
    this.cursoSrv.filtrar(this.filtro)
      .subscribe({
        next: (data) => {
          const cuerpo = 
          Object(data).map((Obj: any) => {
            const datos = [
              Obj.codigo,
              `${Obj.nombre} `,
              Obj.duracion,
              Obj.cupoMaximo
            ];
            return datos;
          });
          this.printSrv.print(encabezado, cuerpo, 'Listado de Cursos', false);
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
