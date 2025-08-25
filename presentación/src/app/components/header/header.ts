import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../shared/services/auth-service';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FrmChangePassw } from '../forms/frm-changePassw/frm-changePassw';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatMenuModule, MatDividerModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  srvAuth = inject(AuthService);
  dialog = inject(MatDialog);

  loggOut() {
    this.srvAuth.loggOut();
  }

  loggIn() {}

  changePasswForm() {
    this.dialog.open(FrmChangePassw, {
      width: '400px', 
      height: '350px',     
      maxWidth: '95vw',
      maxHeight: '95vh'
    });
  }
}
