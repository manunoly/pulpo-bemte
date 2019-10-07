import { ModalController } from '@ionic/angular';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit, Input } from '@angular/core';
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
  @Input() popup = false;

  constructor(private router: Router, public db: DbService, private auth: AuthService, private modalController: ModalController) { }

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
    if (this.popup)
      this.modalController.dismiss();
    this.router.navigateByUrl(url);
  }
}
