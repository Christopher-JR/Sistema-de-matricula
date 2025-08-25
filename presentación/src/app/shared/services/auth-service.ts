import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, retry, map, catchError, of } from 'rxjs';
import { Token } from './token';
import { IToken } from '../models/interfaces';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


const _SERVER = environment.servidor;
const LIMITE_REFRESH = 20;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private srvToken = inject(Token);
  private router = inject(Router);
  
  public userActualS = signal(new User);

  constructor() { }

  public login(datos: { idUsuario: '', passw: '' }): Observable<any> {
    return this.http
    .patch<IToken>(`${_SERVER}/api/auth`, datos) 
      .pipe(
        retry(3), 
        tap((tokens) => { 
          this.doLogin(tokens);
          this.router.navigate(['/home']);
          //console.log('Tokens recibidos:', tokens);
        }),
        map(() => true), 
        catchError((error) => {
          console.error('Error en autenticación:', error);
          return of(error.status)  
        })
      );
  }

  // Cerrar sesión 
  public loggOut() {
    if (this.isLoggedIn()) {
      this.http
        .delete(`${_SERVER}/api/auth/cerrar/${this.userActual.idUsuario}`)
        .subscribe();
        this.doLoggOut(); // eliminar los tokens del localStorage
      
    }
  }

  private doLogin(tokens : IToken){
    // guardar los tokens en el localStorage
    this.srvToken.setTokens(tokens);
    //this.usrActualSubject.next(this.userActual); // actualizar el usuario actual
    this.userActualS.set(this.userActual); // actualizar el usuario actual usando signal
    // actualizar datos globales para usuario y rol 
  }

  // Verifica si existe el token y lo elimina
  private doLoggOut() {
    if(this.srvToken.token) {
      this.srvToken.eliminarTokens(); // eliminar los tokens del localStorage
    }
    this.userActualS.set(this.userActual);
    this.router.navigate(['/login']); // redirigir a la página de inicio de sesión
  }

  public isLoggedIn(): boolean {
    return !!this.srvToken.token && !this.srvToken.jwtTokenExpired(); 
  }

  public get userActual() : User {
    if (!this.srvToken.token) {
      return new User();
    } 
    const tokenD = this.srvToken.decodeToken();
    return new User({ idUsuario: tokenD.sub, nombre: tokenD.nom, rol: tokenD.rol });
  }

  public verificarRefresh () : boolean {
    if(this.isLoggedIn()){
      const tiempo = this.srvToken.tiempoExpToken();
      if(tiempo <= 0){
        this.loggOut();
        return false;
      }
      if(tiempo > 0 && tiempo <= LIMITE_REFRESH) {
        this.srvToken.refreshToken();
      }
      return true;
    } else {
      this.loggOut();
      return false;
    }
  }

  changePassword(idUsuario: string, passw: string, passwN: string) {
    return this.http.patch(
      `${_SERVER}/api/usr/change/${idUsuario}`,
      { passw, passwN }
    );
  }

}
