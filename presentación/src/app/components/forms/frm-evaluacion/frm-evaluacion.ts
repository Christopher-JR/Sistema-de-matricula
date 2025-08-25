import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogoGeneral } from '../dialogo-general/dialogo-general';
import { EvaluacionService } from '../../../shared/services/evaluacion-service';


@Component({
  selector: 'app-frm-evaluacion',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './frm-evaluacion.html',
  styleUrl: './frm-evaluacion.css'
})
export class FrmEvaluacion implements OnInit {

  titulo!: string; 
  srvCliente = inject(EvaluacionService);
  
  private data = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private builder = inject(FormBuilder); 
  private dialogRef = inject(MatDialogRef<FrmEvaluacion>); 
  myForm: FormGroup; 

  constructor() {
    this.myForm = this.builder.group({
      id: [0],
      idMatricula: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ]],
      nota: ['', [
        Validators.required,
        Validators.min(0),  
        Validators.max(100),   
        Validators.pattern('^\\d{1,3}(\\.\\d{1,2})?$') // Permite hasta 3 enteros y 2 decimales
      ]],
      observaciones: ['', [
        Validators.maxLength(255)
      ]],
      fechaEvaluacion: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
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
                texto: 'Evaluación actualizada correctamente',
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
        idMatricula: this.data.datos.idMatricula,
        nota: this.data.datos.nota,
        observaciones: this.data.datos.observaciones,
        fechaEvaluacion: this.data.datos.fechaEvaluacion
      });
    }
  }

}
