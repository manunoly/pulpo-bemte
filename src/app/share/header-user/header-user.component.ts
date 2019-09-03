import { CalificarComponent } from './../calificar/calificar.component';
import { ModalController } from '@ionic/angular';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
})
export class HeaderUserComponent implements OnInit {
  userD;

  constructor(public auth: AuthService, private db: DbService, private modalController: ModalController) { }

  ngOnInit() {
    this.userD = this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          this.db.get('calificaciones-alumno?user_id=' + user.user_id).then(calificar => {
            if (calificar.clase_id != 0) {
              this.calificar(calificar['clase']);
            } else if (calificar.tarea_id != 0) {
              console.log('tarea');
            }
            console.log(calificar);
          }).catch();
          return this.db.get('alumno?user_id=' + user.user_id);
        }
        return of(null)
      }));
  }

  ionViewDidEnter() {
    console.log('entro en header user ionViewDidEnter');
  }

  crearArreglo(cant = 5) {
    let estrellas = [];
    while (cant != 0) {
      estrellas.push(true);
      cant = cant - 1
    }
    return estrellas;
  }

  async calificar(data) {
    const modal = await this.modalController.create({
      component: CalificarComponent,
      componentProps: { calificarData: data, tipo: 'clase' }
    });
    modal.onDidDismiss().then(data => console.log(data));
    return await modal.present();
  }
}
