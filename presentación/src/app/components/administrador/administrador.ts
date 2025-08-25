import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { TipoAdministrador } from '../../shared/models/interfaces';
import { AdministradorService } from '../../shared/services/administrador-service';
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
import { FrmAdministrador } from '../forms/frm-administrador/frm-administrador';

@Component({
  selector: 'app-administrador',
  imports: [MatCardModule, MatTableModule, MatIconModule, MatExpansionModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, MatPaginatorModule], 
  templateUrl: './administrador.html',
  styleUrl: './administrador.css'
})
export class Administrador implements AfterViewInit {
  private readonly administradorSrv = inject(AdministradorService);
  private readonly usuarioSrv = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  public readonly srvAuth = inject(AuthService);
  private readonly printSrv = inject(PrintService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  panelOpenState = signal(false);

  columnas: string[] = ['idAdministrador', 'nombre', 'apellido1', 'apellido2', 'telefono', 'correo', 'botonera'];
  datos: any;

  dataSource = signal(new MatTableDataSource<TipoAdministrador>());

  filtro : any;

  ngAfterViewInit(): void {
    this.filtro = { idAdministrador: '', nombre: '', apellido1: '', apelllido2: '' };
    this.filtrar();
  }
  
  resetFiltro() {
    this.filtro = { idAdministrador: '', nombre: '', apellido1: '', apelllido2: '' };
    this.filtrar();
  }
  
  filtrar() {
    this.administradorSrv.filtrar(this.filtro) 
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
    (document.querySelector('#fidAdministrador') as HTMLInputElement).value = '';
    (document.querySelector('#fnombre') as HTMLInputElement).value = '';
    (document.querySelector('#fapellido1') as HTMLInputElement).value = '';
    (document.querySelector('#fapellido2') as HTMLInputElement).value = '';
  }

  onNuevo() {
    this.mostrarDialogo("Nuevo Administrador");
  }

  mostrarDialogo(titulo: string, datos?: TipoAdministrador) {
    const dialogRef = this.dialog.open(FrmAdministrador,
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
    this.administradorSrv.buscar(id)
    .subscribe({
      next : (data) => {
        this.mostrarDialogo('Editar Administrador', data);
      }
    })
  }
  
  onEliminar(id: number) {
    const dialogRef = this.dialog.open(DialogoGeneral, {
      data: {
        texto: '¿Está seguro de que desea eliminar este administrador?',
        icono: 'question_mark',
        textoAceptar: 'si',
        textoCancelar: 'no' 

      }
    });
    dialogRef.afterClosed().subscribe(resul => {
      if (resul === true) {
        this.administradorSrv.eliminar(id)
          .subscribe((res: any) => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Administrador eliminado correctamente',
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
    this.administradorSrv.buscar(id)
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
            this.usuarioSrv.resetearPassw(data.idAdministrador)
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
    const encabezado = [ 'Id Administrador', 'Nombre', 'Teléfono', 'Correo', 'Dirección', 'Fecha Ingreso' ];
    this.administradorSrv.filtrar(this.filtro)
      .subscribe({
        next: (data) => {
          const cuerpo = 
          Object(data).map((Obj: any) => {
            const datos = [
              Obj.idAdministrador,
              `${Obj.nombre} ${Obj.apellido1} ${Obj.apellido2}`,
              Obj.telefono,
              Obj.correo,
              Obj.direccion,
              Obj.fechaIngreso
            ];
            return datos;
          });
          this.printSrv.print(encabezado, cuerpo, 'Listado de Administradores', false);
        },
        error: (err) => console.error(err)
      });
  }

}
