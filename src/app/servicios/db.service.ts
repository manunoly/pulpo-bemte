import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private http: HttpClient
  ) { }


  private formatErrors(error: any) {
    console.log('error en deService formatErrors', error);
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Promise<any> {
    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors)).toPromise();
  }

  put(path: string, body: Object = {}): Promise<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors)).toPromise();
  }

  post(path: string, body: Object = {}): Promise<any> {
    const resp = { 'id': '12', jwd: 'asdads', nombre: 'test', apellido: 'prueba', roll: 'profesor' };;
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(resp);
      }, 1500);
    });
    /* return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors)).toPromise(); */
  }

  delete(path): Promise<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors)).toPromise();
  }

}
