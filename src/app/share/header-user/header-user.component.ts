import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
})
export class HeaderUserComponent implements OnInit {
  userD;

  constructor(public auth: AuthService, private db: DbService) { }

  ngOnInit() {
    this.userD = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('alumno?user_id=' + user.user_id);
        return of(null)
      }
      ));
  }

  crearArreglo(cant = 5) {
    let estrellas = [];
    while (cant != 0) {
      estrellas.push(true);
      cant = cant - 1
    }
    return estrellas;
  }

}
