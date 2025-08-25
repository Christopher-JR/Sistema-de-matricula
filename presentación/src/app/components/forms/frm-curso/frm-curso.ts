import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CursoService } from '../../../shared/services/curso-service';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';


@Component({
  selector: 'app-frm-curso',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-curso.html',
  styleUrl: './frm-curso.css'
})
export class FrmCurso implements OnInit {

  titulo!: string; 
  srvCliente = inject(CursoService);
  
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private builder = inject(FormBuilder); 
  private dialogRef = inject(MatDialogRef<FrmCurso>); 
  myForm: FormGroup; 

  constructor() {
    this.myForm = this.builder.group({
      id: [0],
      codigo: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('[A-Za-z0-9]*') // acepta letras y números
      ]],
      
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,2}')
      ]],

      descripcion: ['', [
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],

      duracion: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$') // solo números
      ]],

      cupoMaximo: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$') // solo números
      ]]
    })
  }

  get F(){
    return this.myForm.controls; // devuelve los controles del formulario para poder acceder a ellos desde el html
  }

  onGuardar() {
    if (this.myForm.value.id === 0) {
      this.srvCliente.guardar(this.myForm.value)
        .subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Registro creado correctamente',
                icono: 'check',
                textoAceptar: 'Aceptar'
              }
            });
            this.dialogRef.close();
        }})
    } else {
      this.srvCliente.guardar(this.myForm.value, this.myForm.value.id)
        .subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Curso actualizado correctamente',
                icono: 'info',
                textoAceptar: 'Aceptar'
              }
            });
            this.dialogRef.close();
        }})
    }
  }

  ngOnInit(): void {
    this.titulo = this.data.title;
    if (this.data.datos) {
      this.myForm.setValue({
        id: this.data.datos.id,
        codigo: this.data.datos.codigo,
        nombre: this.data.datos.nombre,
        descripcion: this.data.datos.descripcion,
        duracion: this.data.datos.duracion,
        cupoMaximo: this.data.datos.cupoMaximo
      });
    }
  }

}
