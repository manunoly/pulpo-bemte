import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.page.html',
  styleUrls: ['./estado.page.scss'],
})
export class EstadoPage implements OnInit {
  tarea;
  user;

  constructor(public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  // ionViewWillEnter() {
  //   this.actualizar();
  // }

  async ngOnInit() {
    this.actualizar();
  }

  async actualizar() {
    this.tarea = this.auth.user.pipe(
      switchMap(user => {
        this.user = user;
        if (user)
          return this.db.get('tarea-activa?user_id=' + user.user_id)
        return of(null)
      }
      ));
    // this.tarea = this.db.get('tarea-activa?user_id=' + this.user.user_id);
  }

  async terminar(tarea) {
    try {
      this.util.showLoading();
      const resp = await this.db.post('tarea-terminar', { tarea_id: tarea.id });
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('tareas');
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  pagar(tareaD, modo) {
    if (modo === 'transferencia') {
      this.router.navigateByUrl('tareas-pagar', { queryParams: { tarea: tareaD } });
    } else {
      this.router.navigateByUrl('combos');
    }
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }

}
