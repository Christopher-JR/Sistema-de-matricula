import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule,MatDialog,MatDialogRef } from '@angular/material/dialog';
import { FrmLogin } from '../forms/frm-login/frm-login';

@Component({
  selector: 'app-login',
  imports: [MatDialogModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private readonly dialog = inject(MatDialog);

  ngOnInit():void {
    const dialogRef = this.dialog.open(FrmLogin, {
      width: '400px',
      height: '335px',
      disableClose: true 
    });
  }

}
