import { UtilService } from './util.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
// import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  token;

  constructor(
    private http: HttpClient,
    public util: UtilService
  ) {
  }

  async getToken() {
    this.token = await this.util.getStorage('token');
    return this.token;
  }

  async getHeader() {
    let headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.token) {
      headersConfig['Authorization'] = `Token ${this.token}`;
    } else {
      const token = await this.getToken();
      if (token)
        headersConfig['Authorization'] = token;
    }

    return headersConfig;
  }

  handleError(error) {
    console.log('error en deService handleError', error);

    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      console.log('es error del evento ErrorEvent');
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error.error instanceof Object) {
        console.log('el error es Objeto error.error.error instanceof Object');
        for (let x in error.error.error) {
          errorMessage += error.error.error[x] + ' ';
        }
      } else {
        if (error.error.error)
          errorMessage = error.error.error;
        else {
          if (error.error instanceof Object) {
            console.log('el error es Objeto error.error instanceof Object');
            
            if (error.status != 401) {
              errorMessage = 'Ha ocurrido un error inesperado ' + error.status + error.statusText;
            } else {
              for (let x in error.error) {
                errorMessage += error.error[x] + ' ';
              }
            }

          }
          else
            errorMessage = 'Ha ocurrido un error inesperado.';
        }
      }
    }

    setTimeout(async () => {
      await this.util.showMessage(errorMessage);
    }, 1);
    return throwError(errorMessage);
  }

  async get(path: string, params: HttpParams = new HttpParams()): Promise<any> {
    try {
      return await this.http.get(`${environment.api_url}${path}`, { params, headers: await this.getHeader() }).pipe(shareReplay(1)).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(path: string, body: Object = {}): Promise<any> {
    try {
      return await this.http.put(
        `${environment.api_url}${path}`,
        JSON.stringify(body)
      ).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(path: string, body: Object = {}): Promise<any> {
    // const resp = { 'id': '12', jwd: 'asdads', nombre: 'test', apellido: 'prueba', roll: 'profesor' };;
    // return new Promise<any>((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(resp);
    //   }, 1500);
    // });
    try {
      return await this.http.post(
        `${environment.api_url}${path}`,
        JSON.stringify(body), { headers: await this.getHeader() }
      ).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(path): Promise<any> {
    try {
      return await this.http.delete(
        `${environment.api_url}${path}`
        , { headers: await this.getHeader() }).toPromise();
    } catch (error) {
      this.handleError(error);
    }

  }
}
