import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.page.html',
  styleUrls: ['./estado.page.scss'],
})
export class EstadoPage implements OnInit {
  tarea;
  user;

  constructor(public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  ionViewWillEnter() {
    if (this.user) {
      this.actualizar();
    }
  }

  async ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      console.log('me subscribo al user');
      if (user) {
        this.tarea = this.db.get('tarea-activa?user_id=' + user.user_id);
        this.user = user;
      }
    });
  }

  async actualizar() {
    this.tarea = this.db.get('tarea-activa?user_id=' + this.user.user_id);
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
