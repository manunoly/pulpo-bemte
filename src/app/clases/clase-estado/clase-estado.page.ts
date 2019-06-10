import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { switchMap, shareReplay, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-clase-estado',
  templateUrl: './clase-estado.page.html',
  styleUrls: ['./clase-estado.page.scss'],
})
export class ClaseEstadoPage implements OnInit {
  clase;
  user;

  constructor(public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  ngOnInit() {
    this.actualizar();
  }

  async actualizar() {
    this.clase = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('clase-activa?user_id=' + user.user_id)
        return of(null)
      }
      ));
  }

  async terminar(clase) {
    try {
      this.util.showLoading();
      const resp = await this.db.post('clase-terminar', { clase_id: clase.id });
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('clases');
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }


  pagar(claseD, modo) {
    if (modo === 'transferencia') {
      this.router.navigateByUrl('clases-pagar', { queryParams: { clase: claseD } });
    } else {
      this.router.navigateByUrl('combos');
    }
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }

  async setDireccion(calle, referencia, preguntarPor, id) {
    console.log(calle);
    try {
      this.util.showLoading();
      const data = { clase_id: id, calle: calle, referencia: referencia, quien_preguntar: preguntarPor }
      const resp = await this.db.post('clase-confirmar', data);
      if (resp && resp.success)
        this.util.showMessage(resp.success);
      this.actualizar();
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }
}
