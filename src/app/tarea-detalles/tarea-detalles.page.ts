import { ChatPage } from './../chat/chat.page';
import { ModalController } from '@ionic/angular';
import { DbService } from './../servicios/db.service';
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';

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
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.tareaId = this.route.snapshot.paramMap.get("id");
    this.cargarTarea();
    console.log(this.tareaId);
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

}
