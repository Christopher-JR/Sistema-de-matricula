import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-frm-login',
  imports: [MatDialogModule, MatIconModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDividerModule],
  templateUrl: './frm-login.html',
  styleUrl: './frm-login.css'
})
export class FrmLogin {
  readonly dialogRef = inject(MatDialogRef<FrmLogin>);
  
  frmLogin: FormGroup;
  private srvAuth = inject(AuthService)
  private builder = inject(FormBuilder);
  public errorLogin = signal(false);


  constructor() {
    this.frmLogin = this.builder.group({
      id: (0), 
      idUsuario: [''],
      passw: [''] 
    });
  }

  onlogin() {
    delete this.frmLogin.value.id; 
    console.log(this.frmLogin.value);
    this.srvAuth.login(this.frmLogin.value)
      .subscribe((res) => {
        this.errorLogin.set(!res || res === 401); // Si la respuesta es 401 o false, errorLogin será true
        if (!this.errorLogin()) {
          this.dialogRef.close(); // Cerrar el diálogo si la autenticación es exitosa
        }
    })
  }

}
