import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';
import { MatriculaService } from '../../../shared/services/matricula-service';


@Component({
  selector: 'app-frm-matricula',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-matricula.html',
  styleUrl: './frm-matricula.css'
})
export class FrmMatricula implements OnInit {

  titulo!: string; 
  srvCliente = inject(MatriculaService);
  
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private builder = inject(FormBuilder); 
  private dialogRef = inject(MatDialogRef<FrmMatricula>); 
  myForm: FormGroup; 

  constructor() {
    this.myForm = this.builder.group({
      id: [0],
      idEstudiante: ['', [
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern('^[a-zA-Z0-9]*$')
    ]],
    idGrupo: ['', [
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]],
    fechaMatricula: ['', [
      Validators.minLength(10), 
      Validators.maxLength(10), 
    ]],
    estado: ['', [
      Validators.maxLength(20)
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
                texto: 'Matrícula actualizada correctamente',
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
        idGrupo: this.data.datos.idGrupo,
        fechaMatricula: this.data.datos.fechaMatricula,
        estado: this.data.datos.estado
      });
    }
  }

}
