import { ChatPage } from './../../chat/chat.page';
import { MapPage } from './../../map/map.page';
import { ModalController } from '@ionic/angular';
import { DbService } from './../../servicios/db.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

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
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.claseId = this.route.snapshot.paramMap.get("id");
    this.cargarClase();
    console.log(this.claseId);
  } 

  cargarClase() {
    this.claseO = this.db.get('devuelve-clase?clase_id=' + this.claseId);
  }

  accionHoras($event) {
    console.log('la accion de las horas es', $event);
    this.cargarClase();
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
}
