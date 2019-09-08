import { ClaseAplicadaProfesorPage } from './../clase-aplicada-profesor/clase-aplicada-profesor.page';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tareas-listado',
  templateUrl: './tareas-listado.page.html',
  styleUrls: ['./tareas-listado.page.scss'],
})
export class TareasListadoPage implements OnInit {
  tareas;
  user;
  detallesTareaId;

  constructor(public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService, public modalController: ModalController) { }

  async ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.auth.currentUser.subscribe(user => {
      if (user) {
        this.tareas = this.db.get('tareas-disponibles?user_id=' + user.user_id);
        this.user = user;
      }
    });
  }


  setDetallesTareaId(id) {
    if(id == this.detallesTareaId)
      return this.detallesTareaId = '';
    this.detallesTareaId = id;
  }

  async aplicar(tarea) {
    const alert = await this.alertController.create({
      header: 'Aplicar a la tarea',
      message: 'Detalle los siguientes datos',
      inputs: [
        {
          name: 'tiempo',
          type: 'number',
          placeholder: 'Tiempo en horas de la tarea',
          min: 0
        },
        {
          name: 'inversion',
          type: 'number',
          placeholder: 'Costo de la tarea',
          min: 0
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Aplicar',
          handler: async (data) => {
            if (!data || !data.tiempo || !data.inversion)
              return this.util.showMessage('Por favor revisar los datos ingresados');

            this.util.showLoading();
            try {
              const user = await this.auth.getUserData();
              const postData = {
                user_id: user.user_id,
                tarea_id: tarea.id,
                ...data
              }
              console.log(postData);
              const resp = await this.db.post('aplicar-tarea', postData);
              this.util.dismissLoading();
              if (resp && resp.success){
                this.util.showMessage(resp.success);
                this.util.showMessage(resp.success);
                const modal = await this.modalController.create({
                  component: ClaseAplicadaProfesorPage,
                  componentProps: { data: tarea, tipo: 'Tareas' }
                });
                modal.onDidDismiss().then(data => {
                  this.cargarTareas();
                });
                return await modal.present();
              }
            } catch (error) {
              console.log(error);
              this.util.dismissLoading();
            }

          }
        }
      ]
    });

    await alert.present();
  }

}
