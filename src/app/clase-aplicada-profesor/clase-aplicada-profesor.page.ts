import { Component, OnInit } from '@angular/core';
import { UtilService } from './../servicios/util.service';

@Component({
  selector: 'app-clase-aplicada-profesor',
  templateUrl: './clase-aplicada-profesor.page.html',
  styleUrls: ['./clase-aplicada-profesor.page.scss'],
})
export class ClaseAplicadaProfesorPage implements OnInit {
  data;
  tipo;

  constructor(public util: UtilService) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    const datosTmp = this.util.getTemporalData();
    console.log('clase o tarea aplicada', datosTmp);
    if (datosTmp == undefined)
      this.util.atras();
    else {
      this.data = datosTmp.data;
      this.tipo = datosTmp.tipo;
    }
  }

  cerrar() { }

}
