import { ClaseAplicadaProfesorPage } from './../clase-aplicada-profesor/clase-aplicada-profesor.page';
import { Router } from '@angular/router';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilService } from '../servicios/util.service';

@Component({
  selector: 'app-clases-listado',
  templateUrl: './clases-listado.page.html',
  styleUrls: ['./clases-listado.page.scss'],
})
export class ClasesListadoPage implements OnInit {
  clases;
  user;
  detallesClaseId;

  constructor(public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService, public modalController: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarClases();
  }

  async cargarClases() {
    this.clases = this.auth.user.pipe(
      switchMap(user => {
        this.user = user;
        if (user)
          return this.db.get('clases-disponibles?user_id=' + user.user_id);
        return of(null)
      }
      ));
  }


  async aplicar(clases) {
    const alert = await this.alertController.create({
      header: 'Aplicar',
      message: ``,
      inputs: [
        {
          name: 'hora1',
          type: 'radio',
          label: clases.hora1,
          value: clases.hora1
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
            console.log(data);
            if (data == undefined)
              return this.util.showMessage('Por favor confirme la hora');
            this.util.showLoading();
            let hora = data;
            try {
              const postData = {
                user_id: this.user.user_id,
                clase_id: clases.id,
                hora: hora
              }
              console.log(postData);
              const resp = await this.db.post('aplicar-clase', postData);
              this.util.dismissLoading();
              if (resp && resp.success) {
                this.util.showMessage(resp.success);
                const modal = await this.modalController.create({
                  component: ClaseAplicadaProfesorPage,
                  componentProps: { data: clases, tipo: 'Clases' }
                });
                modal.onDidDismiss().then(data => {
                  this.cargarClases();
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

  setDetallesClaseId(id) {
    if (id == this.detallesClaseId)
      return this.detallesClaseId = '';
    this.detallesClaseId = id;
  }

}
