import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';
import { switchMap, first } from 'rxjs/operators';

@Component({
  selector: 'app-header-bemte',
  templateUrl: './header-bemte.component.html',
  styleUrls: ['./header-bemte.component.scss'],
})
export class HeaderBemteComponent implements OnInit {
  notificion;

  constructor(private router: Router, public db: DbService, private auth: AuthService) { }

  async ngOnInit() {
    this.auth.user.pipe(first(),
      switchMap(user => {
        if (user) {
          return this.db.get('nueva-notificacion?user_id=' + user.user_id)
            .then(not => {
              this.db.setEstadoNotificacion(not); this.notificion = this.db.getEstadoNotificacion();
            }).catch();
        }
      }
      ));
  }

  goTo(url) {
    this.router.navigateByUrl(url);
  }
}
