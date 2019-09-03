import { AuthService } from './../../servicios/auth.service';
import { ChatPage } from './../../chat/chat.page';
import { MapPage } from './../../map/map.page';
import { ModalController, AlertController } from '@ionic/angular';
import { DbService } from './../../servicios/db.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UtilService } from 'src/app/servicios/util.service';

@Component({
  selector: 'app-clase-detalles',
  templateUrl: './clase-detalles.page.html',
  styleUrls: ['./clase-detalles.page.scss'],
})
export class ClaseDetallesPage implements OnInit {
  claseId;
  claseO;
  claseObjet = {
    "user_id": 24,
    "materia": "Economia",
    "tema": "mi tema eco",
    "fecha": "2019-08-27",
    "hora1": "07:00",
    "hora2": null,
    "personas": "1",
    "duracion": "2",
    "combo": "COMBO",
    "ubicacion": "El Comercio 125, Quito 170135, Ecuador",
    "coordenadas": '{"lat":-0.1754103046461042,"lng":-78.48091638172303}',
    "estado": "Sin_Pago",
    "seleccion_profesor": false,
    "activa": true,
    "horasCombo": null,
    "precioCombo": null,
    "updated_at": "2019-08-27 09:44:04",
    "created_at": "2019-08-27 09:44:04",
    "id": 64
  };

  constructor(private route: ActivatedRoute,
    private db: DbService,
    private modalController: ModalController,
    private alertController: AlertController,
    private util: UtilService, private router: Router,
    private auth: AuthService
  ) { }

  ionViewWillEnter() {
    this.claseId = this.route.snapshot.paramMap.get("id");
    this.cargarClase();
  }

  ngOnInit() {

  }

  cargarClase() {
    this.claseO = this.db.get('devuelve-clase?clase_id=' + this.claseId);
  }

  accionHoras($event) {
    console.log('la accion de las horas es', $event);
    if ($event)
      this.cargarClase();
    else if ($event == false)
      this.router.navigateByUrl('lista-clases');
  }


  async map(coordenadas) {
    const modal = await this.modalController.create({
      component: MapPage,
      componentProps: { ubicacion: JSON.parse(coordenadas) }
    });
    modal.onDidDismiss().then(data => console.log(data));
    return await modal.present();
  }

  async openChat(claseD) {
    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { clase: claseD }
    });
    return await modal.present();
  }

  async confirmarCancelar(clase) {
    if (!clase || clase == {})
      return;
    const alert = await this.alertController.create({
      header: 'Cancelar!',
      message: 'Al cancelar se le descuenta 1 hora, si es 3 horas o menos de la clase se descuentan todas las horas, Desea cancelar?',
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
            this.terminar(clase);
          }
        }
      ]
    });

    await alert.present();
  }


  async terminar(clase) {
    try {
      this.util.showLoading();
      const user = await this.auth.getUserData();
      const resp = await this.db.post('clase-terminar', { clase_id: clase.id, user_id: user.user_id, cancelar: 1, profesor: 0 });
      this.util.dismissLoading();
      this.db.setComboToBuy('');
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('lista-clases');
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }
}
