import { AuthService } from './../servicios/auth.service';
import { ChatPage } from './../chat/chat.page';
import { ModalController, AlertController } from '@ionic/angular';
import { DbService } from './../servicios/db.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../servicios/util.service';

@Component({
  selector: 'app-tarea-detalles',
  templateUrl: './tarea-detalles.page.html',
  styleUrls: ['./tarea-detalles.page.scss'],
})
export class TareaDetallesPage implements OnInit {
  tareaId;
  tareaO;

  constructor(private route: ActivatedRoute,
    private db: DbService,
    private modalController: ModalController,
    private alertController: AlertController,
    private util: UtilService, private router: Router,
    private auth: AuthService
  ) { }

  ionViewWillEnter() {
    this.tareaId = this.route.snapshot.paramMap.get("id");
    this.cargarTarea();
  }

  ngOnInit() {
  }

  cargarTarea() {
    this.tareaO = this.db.get('devuelve-tarea?tarea_id=' + this.tareaId);
  }

  accionHoras($event) {
    console.log('la accion de las horas es', $event);
    this.cargarTarea();
  }

  async openChat(tareaD) {
    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { tarea: tareaD }
    });
    return await modal.present();
  }

  async confirmarCancelar(tarea) {
    const alert = await this.alertController.create({
      header: 'Cancelar!',
      message: 'Está seguro que desea cancelar? Puede implicar una penalización!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.terminar(tarea);
          }
        }
      ]
    });

    await alert.present();
  }

  async terminar(tarea) {
    try {
      this.util.showLoading();
      const user = await this.auth.getUserData();
      const resp = await this.db.post('tarea-terminar', { tarea_id: tarea.id, user_id: user.user_id, cancelar: 1, profesor: 0 });
      this.util.dismissLoading();
      this.db.setComboToBuy('');
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('inicio');
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

}
