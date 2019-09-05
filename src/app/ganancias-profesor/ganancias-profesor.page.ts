import { Router } from '@angular/router';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilService } from '../servicios/util.service';

@Component({
  selector: 'app-ganancias-profesor',
  templateUrl: './ganancias-profesor.page.html',
  styleUrls: ['./ganancias-profesor.page.scss'],
})
export class GananciasProfesorPage implements OnInit {
  ganancias;
  tipo = 'CLASES';

  constructor(public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarGanancias();
  }

  cargarGanancias() {
    this.ganancias = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('cuenta-profesor?user_id=' + user.user_id + '&tipo=' + this.tipo);
        return of(null)
      }
      ));
  }


  setTipo(tipo) {
    this.tipo = tipo;
    this.cargarGanancias();
  }

}
