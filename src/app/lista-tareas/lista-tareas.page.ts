import { CalificarComponent } from '../share/calificar/calificar.component';
import { Component, OnInit } from '@angular/core';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import { of } from 'rxjs';


@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.page.html',
  styleUrls: ['./lista-tareas.page.scss'],
})
export class ListaTareasPage implements OnInit {
  tareas;
  tipo = 'ACTUAL';
  detallesTareaId;

  constructor(public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService, public modalController: ModalController) {
  }

  ionViewWillEnter(){
    this.cargarTareas();
  }

  ngOnInit() {
  }

  cargarTareas() {
    this.tareas = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('lista-tareas?user_id=' + user.user_id + '&tipo=' + this.tipo)
        return of(null)
      }));
  }

  async calificar(tarea) {
    const modal = await this.modalController.create({
      component: CalificarComponent,
      componentProps: { idProfesor: tarea.user_id_pro, tarea: tarea.id }
    });
    return await modal.present();
  }

  setDetallesTareaId(id) {
    if(id == this.detallesTareaId)
      return this.detallesTareaId = '';
    this.detallesTareaId = id;
  }

  setTipoTarea(tipo) {
    this.tipo = tipo;
    this.cargarTareas();
  }

  getColor(estado) {
    return 'secondary';
  }
}
