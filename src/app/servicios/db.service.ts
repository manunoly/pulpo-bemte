import { UtilService } from './util.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  token;
  combo;
  headers;
  estadoNotificacion;
  newChat$ = new BehaviorSubject<any>(false);
  
  public estadoProfesor;
  public photo_url;
  
  constructor(
    private http: HttpClient,
    public util: UtilService
  ) {
    this.getHeader();
  }

  get photoUrl(){
    if(!this.photo_url)
      this.photo_url = environment.photo_url;
    return this.photo_url;
  }

  getEstadoProfesor() {
    return this.estadoProfesor;
  }

  setEstadoProfesor(estado) {
    this.estadoProfesor = estado;
  }

  getEstadoNotificacion() {
    return this.estadoNotificacion;
  }

  setEstadoNotificacion(estado) {
    this.estadoNotificacion = estado;
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
    this.headers = headersConfig;
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

  get(path: string, params: HttpParams = new HttpParams()): Promise<any> {
    this.getHeader();
    try {
      return this.http.get(`${environment.api_url}${path}`, { params, headers: this.headers }).toPromise();
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(path: string, body: Object = {}): Promise<any> {
    this.getHeader();
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

  setComboToBuy(combo) {
    this.combo = combo;
  }


  getComboToBuy() {
    return this.combo ? this.combo : '';
  }
}
