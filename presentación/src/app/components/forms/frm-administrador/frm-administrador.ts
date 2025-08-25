import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';
import { AdministradorService } from '../../../shared/services/administrador-service';


@Component({
  selector: 'app-frm-administrador',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-administrador.html',
  styleUrl: './frm-administrador.css'
})
export class FrmAdministrador implements OnInit {

  titulo!: string; 
  srvProfesor = inject(AdministradorService);
  
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private builder = inject(FormBuilder); 
  private dialogRef = inject(MatDialogRef<FrmAdministrador>); 
  myForm: FormGroup; 

  constructor() {
    this.myForm = this.builder.group({
    id: [0],
    idAdministrador: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(15),
      Validators.pattern('^[a-zA-Z0-9]*$')
  ]],
  nombre: ['', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
    Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$')
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
    Validators.pattern('^[0-9+]*$')
  ]],
  correo: ['', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ]],
  direccion: ['', [
    Validators.minLength(4),
    Validators.maxLength(255)
  ]],
    fechaIngreso: [''] 
  });
  }

  get F(){
    return this.myForm.controls; // devuelve los controles del formulario para poder acceder a ellos desde el html
  }

  onGuardar() {
    console.log(this.myForm.value);
    delete this.myForm.value.fechaIngreso;
    if (this.myForm.value.id === 0) {
      this.srvProfesor.guardar(this.myForm.value)
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
      this.srvProfesor.guardar(this.myForm.value, this.myForm.value.id)
        .subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Administrador actualizado correctamente',
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
        idAdministrador: this.data.datos.idAdministrador,
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
