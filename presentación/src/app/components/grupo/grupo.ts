import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { TipoGrupo } from '../../shared/models/interfaces';
import { GrupoService } from '../../shared/services/grupo-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
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
import { FrmGrupo } from '../forms/frm-grupo/frm-grupo';

@Component({
  selector: 'app-grupo',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatExpansionModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, MatPaginatorModule], 
  templateUrl: './grupo.html',
  styleUrl: './grupo.css'
})
export class Grupo implements AfterViewInit {
  private readonly grupoSrv = inject(GrupoService);
  private readonly usuarioSrv = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  public readonly srvAuth = inject(AuthService);
  private readonly printSrv = inject(PrintService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  panelOpenState = signal(false);

  columnas: string[] = ['idCurso', 'idProfesor', 'fechaInicio', 'fechaFin', 'horario', 'aula', 'botonera'];
  datos: any;

  dataSource = signal(new MatTableDataSource<TipoGrupo>());

  filtro : any;

  ngAfterViewInit(): void {
    this.filtro = { idGrupo: '', fechaInicio: '', horario: '', aula: '' };
    this.filtrar();
  }
  
  resetFiltro() {
    this.filtro = { idGrupo: '', fechaInicio: '', horario: '', aula: '' };
    this.filtrar();
  }
  
  filtrar() {
    this.grupoSrv.filtrar(this.filtro) 
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
    (document.querySelector('#fidGrupo') as HTMLInputElement).value = '';
    (document.querySelector('#finicio') as HTMLInputElement).value = '';
    (document.querySelector('#fhorario') as HTMLInputElement).value = '';
    (document.querySelector('#faula') as HTMLInputElement).value = '';
  }

  onNuevo() {
    this.mostrarDialogo("Nuevo Grupo");
  }

  mostrarDialogo(titulo: string, datos?: TipoGrupo) {
    const dialogRef = this.dialog.open(FrmGrupo,
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
    this.grupoSrv.buscar(id)
    .subscribe({
      next : (data) => {
        this.mostrarDialogo('Editar Grupo', data);
      }
    })
  }
  
  onEliminar(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar este grupo?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no' 

      }
    });
    dialogRef.afterClosed().subscribe(resul => {
      if (resul === true) {
        this.grupoSrv.eliminar(id)
          .subscribe((res: any) => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Grupo eliminado correctamente',
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

  

  onImprimir() {
    const encabezado = [ 'Id Curso', 'Id Profesor', 'Fecha Inicio', 'Fecha Fin', 'Horario', 'Aula' ];
    this.grupoSrv.filtrar(this.filtro)
      .subscribe({
        next: (data) => {
          const cuerpo = 
          Object(data).map((Obj: any) => {
            const datos = [
              Obj.idCurso,
              Obj.idProfesor,
              Obj.fechaInicio,
              Obj.fechaFin,
              Obj.horario,
              Obj.aula
            ];
            return datos;
          });
          this.printSrv.print(encabezado, cuerpo, 'Listado de Grupos', false);
        },
        error: (err) => console.error(err)
      });
  }

}
