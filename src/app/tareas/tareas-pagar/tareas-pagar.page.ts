import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tareas-pagar',
  templateUrl: './tareas-pagar.page.html',
  styleUrls: ['./tareas-pagar.page.scss'],
})
export class TareasPagarPage implements OnInit {
  user;
  data;
  tipo;

  constructor(public auth: AuthService, private db: DbService, private route: ActivatedRoute,
    private navigation: Location, private router: Router, public util: UtilService) { }

  ngOnInit() {
    console.log('TareasPagarPage load');
    this.auth.currentUser.subscribe(user => {
      if (user) {
        console.log(user);
        this.user = user;
        this.tipo = this.route.snapshot.paramMap.get('tipo');
        this.data = this.route.snapshot.paramMap.get('data');
      }
    });
  }

  async confirmarPago() {

    const postData = {
      user_id: this.user.user_id,
      combo_id: 0,
      tarea_id: this.tipo === 'tarea' ? this.data : 0,
      clase_id: this.tipo === 'clase' ? this.data : 0,
      archivo: null,
      drive: 'http://prueba.com'
    }

    try {
      this.util.showLoading();
      const resp = await this.db.post('subir-transferencia', postData);
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);

      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  atras() {
    this.navigation.back();
  }

  subir() {
    this.util.showMessage('en construcción');
  }

}
