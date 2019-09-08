import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from './../servicios/util.service';

@Component({
  selector: 'app-clase-aplicada-profesor',
  templateUrl: './clase-aplicada-profesor.page.html',
  styleUrls: ['./clase-aplicada-profesor.page.scss'],
})
export class ClaseAplicadaProfesorPage implements OnInit {
  data;
  tipo;

  constructor(public util: UtilService, public modalController: ModalController) { }

  ngOnInit() {
  }

  cerrar() {
    this.modalController.dismiss();
  }
}
