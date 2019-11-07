import { environment } from 'src/environments/environment.prod';
import { UtilService } from './util.service';
import { DbService } from './db.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userD;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private db: DbService,
    private http: HttpClient,
    private util: UtilService,
    private router: Router
  ) {
    this.loadFromLocal();
    this.currentUserSubject.subscribe(user => {
      this.userD = user;
      this.util.setEsProfesor(user && user.tipo == 'Profesor');
    })
  }

  async login(data) {
    const user = await this.db.post('login', data);
    if (user) {
      await this.setAuth(user.profile);
      return user.profile;
    }
    return false;
  }

  async loadFromLocal() {
    try {
      let user = JSON.parse(await this.util.getStorage('user'));
      if (user && user != undefined) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        if (user.tipo == 'Profesor')
          this.router.navigate(['/inicio-profesor'], { replaceUrl: true })
        // this.router.navigateByUrl('inicio-profesor');
        else
          this.router.navigate(['/inicio'], { replaceUrl: true });
        // this.router.navigateByUrl('inicio');

      } else {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    } catch (error) {
      this.router.navigate(['/login'], { replaceUrl: true });
      console.log('auth load from local storage user', error);
    }
  }

  setAuth(user) {
    console.log('este usuario voy a escribir 0', user);
    if (user && user['avatar'] && user['avatar'] != '' && user['avatar'] != 'users/default.png')
      user['avatar'] = environment.photo_url + user['avatar'];
    else
      user['avatar'] = '/assets/icon/favicon.png';

    console.log('este usuario ya escribi en auth', user);
    user = JSON.stringify(user);

    this.util.setStorage('token', user.token);
    this.util.setStorage('user', user);
    this.currentUserSubject.next(JSON.parse(user));
    this.isAuthenticatedSubject.next(true);
  }

  get user(): Observable<any> {
    return this.currentUserSubject;
  }

  async getUserData() {
    if (this.userD == undefined || this.userD == null)
      this.userD = await this.util.getStorage('user');
    if (typeof (this.userD) == 'string')
      this.userD = JSON.parse(this.userD);
    return this.userD;
  }

  purgeAuth() {
    this.util.removeStorage('token');
    this.util.removeStorage('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigateByUrl('login');
  }

  olvidarContrasena(email) {
    return this.db.post('resetPass', { email: email });
  }
}
