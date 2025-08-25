import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlumnoService } from '../../../shared/services/alumno-service';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';


@Component({
  selector: 'app-frm-estudiante',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-estudiante.html',
  styleUrl: './frm-estudiante.css'
})
export class FrmEstudiante implements OnInit {

  titulo!: string; 
  srvEstudiante = inject(AlumnoService);
  
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private builder = inject(FormBuilder); 
  private dialogRef = inject(MatDialogRef<FrmEstudiante>); 
  myForm: FormGroup; 

  constructor() {
    this.myForm = this.builder.group({
    id: [0],
    idEstudiante: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('^[a-zA-Z0-9]*$') // Solo letras y números
    ]],
    nombre: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$') // Solo letras y espacios
    ]],
    apellido1: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$')
    ]],
    apellido2: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$')
    ]],
    telefono: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(13),
      Validators.pattern('^[0-9+]*$') // Solo números y el símbolo "+"
    ]],
    correo: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ]],
    direccion: ['', [
      Validators.minLength(4),
      Validators.maxLength(300)
    ]],
    fechaIngreso: [''] // Puedes agregar validaciones si lo necesitas
  });
  }

  get F(){
    return this.myForm.controls; // devuelve los controles del formulario para poder acceder a ellos desde el html
  }

  onGuardar() {
    console.log(this.myForm.value);
    delete this.myForm.value.fechaIngreso;
    if (this.myForm.value.id === 0) {
      this.srvEstudiante.guardar(this.myForm.value)
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
      this.srvEstudiante.guardar(this.myForm.value, this.myForm.value.id)
        .subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Estudiante actualizado correctamente',
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
        idEstudiante: this.data.datos.idEstudiante,
        nombre: this.data.datos.nombre,
        apellido1: this.data.datos.apellido1,
        apellido2: this.data.datos.apellido2,
        telefono: this.data.datos.telefono,
        correo: this.data.datos.correo,
        direccion: this.data.datos.direccion,
        fechaIngreso: this.data.datos.fechaIngreso
      });
    }
  }

}
