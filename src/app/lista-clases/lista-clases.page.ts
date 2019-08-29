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
  selector: 'app-lista-clases',
  templateUrl: './lista-clases.page.html',
  styleUrls: ['./lista-clases.page.scss'],
})
export class ListaClasesPage implements OnInit {
  clases;
  tipo = 'ACTUAL';
  detallesClaseId;

  constructor(public modalController: ModalController, public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  ngOnInit() {
    this.cargarClases();
  }

  setTipoClase(tipo) {
    this.tipo = tipo;
    this.cargarClases();
  }

  async cargarClases() {
    this.clases = this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          return this.db.get('lista-clases?user_id=' + user.user_id + '&tipo=' + this.tipo);
        }
        return of(null);
      }
      ));
  }

  setDetallesClaseId(id) {
    this.detallesClaseId = id;
  }

  async calificar(clase) {
    console.log('califica esta clase', clase);
    const modal = await this.modalController.create({
      component: CalificarComponent,
      componentProps: { idProfesor: clase.user_id_pro, clase: clase.id }
    });
    return await modal.present();
  }

  getColor(estado) {
    return 'secondary';
  }
}
