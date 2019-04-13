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
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private db: DbService,
    private http: HttpClient,
    private util: UtilService,
    private router: Router
  ) { }

  async login(data) {
    const user = await this.db.post('login', data);
    if (user) {
      this.setAuth(user);
      return true;
    }
  }

  setAuth(user) {
    this.util.setStorage('token', user.token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  get user(): Observable<any> {
    return this.currentUserSubject;
  }

  purgeAuth() {
    this.util.removeStorage('jwt');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigateByUrl('login');
  }
}
