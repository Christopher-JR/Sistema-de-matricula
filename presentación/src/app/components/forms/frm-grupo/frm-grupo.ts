import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';
import { GrupoService } from '../../../shared/services/grupo-service';


@Component({
  selector: 'app-frm-grupo',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-grupo.html',
  styleUrl: './frm-grupo.css'
})
export class FrmGrupo implements OnInit {

  titulo!: string; 
  srvGrupo = inject(GrupoService);
  
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private builder = inject(FormBuilder); 
  private dialogRef = inject(MatDialogRef<FrmGrupo>); 
  myForm: FormGroup; 

  constructor() {
    this.myForm = this.builder.group({
  id: [0], 
  idCurso: ['', [
    Validators.required,
    Validators.pattern('^[0-9]*$')
  ]],
  idProfesor: ['', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(15),
    Validators.pattern('^[a-zA-Z0-9]*$')
  ]],
  fechaInicio: ['', [
    Validators.required,
    Validators.maxLength(10)
  ]],
  fechaFin: ['', [
    Validators.required,
    Validators.maxLength(10)
  ]],
  horario: ['', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100)
  ]],
  aula: ['', [
    Validators.minLength(2),
    Validators.maxLength(50)
  ]]
});
  }

  get F(){
    return this.myForm.controls; // devuelve los controles del formulario para poder acceder a ellos desde el html
  }

  onGuardar() {
    console.log(this.myForm.value);
    if (this.myForm.value.id === 0) {
      this.srvGrupo.guardar(this.myForm.value)
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
      this.srvGrupo.guardar(this.myForm.value, this.myForm.value.id)
        .subscribe({
          complete: () => {
            this.dialog.open(DialogoGeneral, {
              data: {
                texto: 'Grupo actualizado correctamente',
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
        idCurso: this.data.datos.idCurso,
        idProfesor: this.data.datos.idProfesor,
        fechaInicio: this.data.datos.fechaInicio,
        fechaFin: this.data.datos.fechaFin,
        horario: this.data.datos.horario,
        aula: this.data.datos.aula
      });
    }
  }

}
