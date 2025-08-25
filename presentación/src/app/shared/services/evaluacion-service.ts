import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TipoEvaluacion } from '../models/interfaces';
import { retry, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const _SERVER = environment.servidor;

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private readonly http = inject(HttpClient)

  constructor() { }

  filtrar(parametros: any) {
    let params = new HttpParams;

    for (const prop in parametros) {
      params = params.append(prop, parametros[prop])
    }
    return this.http.get<any>(`${_SERVER}/api/evaluacion/filtrar/0/5`, 
      { params: params }
    );
  }

  guardar(datos: TipoEvaluacion, id?: number) {
    delete datos.id; 
    console.log(datos);
    if (id) {
      return this.http.put<any>(`${_SERVER}/api/evaluacion/${id}`, datos);
    } else {
      return this.http.post<any>(`${_SERVER}/api/evaluacion`, datos);
    }
  }

  eliminar(id: number) {
    return this.http.delete<any>(`${_SERVER}/api/evaluacion/${id}`)
      .pipe(
        retry(3), 
        map(() => true), 
        catchError(this.handleRrror)
      );
  }

  buscar(id: number) {
    return this.http.get<TipoEvaluacion>(`${_SERVER}/api/evaluacion/buscar/${id}`)
  }

  private handleRrror(error: any) {
    return throwError(
      () => {
        return error.status
      }
    )
  }

}
