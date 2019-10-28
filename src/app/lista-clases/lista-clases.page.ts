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

  ionViewWillEnter() {
    this.cargarClases();
  }

  ngOnInit() {
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
    if (id == this.detallesClaseId)
      return this.detallesClaseId = '';
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

  async confirmaEliminarClase(clase){
    console.log('eliminar clase', clase);
    
      if (!clase || clase == {})
        return;

        const alert = await this.alertController.create({
        header: '¿Estás seguro que deseas eliminar?',
        cssClass: 'fondoRojo alertRojo',
        inputs: [
          {
            name: 'Si',
            type: 'radio',
            label: 'Si',
            value: true
          },
          {
            name: 'No',
            type: 'radio',
            label: 'No',
            value: false
          }],
        buttons: [{
          text: 'Aceptar',
          handler: (data) => {
            if (data)
              this.eliminarClase(clase);
          }
        }
        ]
      });
  
      await alert.present();
  }

  async eliminarClase(clase){
    try {
      this.util.showLoading();
      const user = await this.auth.getUserData();
      const resp = await this.db.post('clase-tarea-eliminar', { clase_id: clase.id, user_id: user.user_id, tarea_id: 0 });
      this.util.dismissLoading();
      
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.cargarClases();
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async actualizar(event) {
    this.cargarClases();

    setTimeout(() => {
      event.target.complete();
    }, 600);
  }
}
