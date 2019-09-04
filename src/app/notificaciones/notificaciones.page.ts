import { AuthService } from './../servicios/auth.service';
import { DbService } from './../servicios/db.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../servicios/util.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificaciones;

  constructor(private db: DbService, public util: UtilService, public auth: AuthService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.notificaciones = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('notificaciones?user_id=' + user.user_id);
        return of(null)
      }));
  }

}
