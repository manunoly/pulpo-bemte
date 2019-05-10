import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tareas-listado',
  templateUrl: './tareas-listado.page.html',
  styleUrls: ['./tareas-listado.page.scss'],
})
export class TareasListadoPage implements OnInit {
  tareas;
  user;

  constructor(public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  async ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      console.log(user);
      if (user) {
        this.tareas = this.db.get('tareas-disponibles?user_id=12');
        // this.tareas = this.db.get('tareas-disponibles?user_id=' + user.user_id);
        this.user = user;
      }
    });
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
              const postData = {
                user_id: 13,
                tarea_id: tarea.id,
                ...data
              }
              console.log(postData);
              const resp = await this.db.post('aplicar-tarea', postData);
              if (resp && resp.success)
                this.util.showMessage(resp.success);
              this.util.dismissLoading();

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
