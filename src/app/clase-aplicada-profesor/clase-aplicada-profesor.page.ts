import { Router } from '@angular/router';
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

  constructor(public util: UtilService, private router: Router) {
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


  async actualizar(event) {
    setTimeout(() => {
      event.target.complete();
      if (this.tipo == "Clases")
        this.router.navigateByUrl('clase-detalles/' + this.data['id']);
      else
        this.router.navigateByUrl('tarea-detalles/' + this.data['id']);

    }, 1000);

    setTimeout(() => {
      if (this.tipo == "Clases")
        this.router.navigateByUrl('lista-clases');
      else
        this.router.navigateByUrl('lista-tareas');
    }, 400);
  }
}
