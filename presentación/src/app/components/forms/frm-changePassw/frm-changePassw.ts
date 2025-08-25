import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';         
import { MatButtonModule } from '@angular/material/button';  
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-frm-changePassw',
  imports: [CommonModule, MatDialogModule, MatDividerModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './frm-changePassw.html',
  styleUrl: './frm-changePassw.css'
})
export class FrmChangePassw {
  private srvAuth = inject(AuthService);
  private builder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<FrmChangePassw>);

  frmChange: FormGroup;
  error = false;

  constructor() {
    this.frmChange = this.builder.group({
      passw: ['', Validators.required],   
      passwN: ['', Validators.required] 
    });
  }

  onChangePassw() {
  console.log('Intentando cambiar contraseña...');
  const idUsuario = this.srvAuth.userActual.idUsuario;
  const { passw, passwN } = this.frmChange.value;
  this.srvAuth.changePassword(idUsuario, passw, passwN)
    .subscribe({
      next: (res) => {
        console.log('Respuesta:', res); // <-- AQUÍ
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = true;
      }
    });
}
}