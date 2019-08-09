import { AlertController } from '@ionic/angular';
import { UploadService } from './../../servicios/upload.service';
import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { switchMap, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-clase-estado',
  templateUrl: './clase-estado.page.html',
  styleUrls: ['./clase-estado.page.scss'],
})
export class ClaseEstadoPage implements OnInit {
  clase;
  user;
  horasCombo;
  img;
  constructor(private alertController: AlertController, public upload: UploadService, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  ngOnInit() {
    this.actualizar();
  }

  async actualizar() {
    this.clase = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('clase-activa?user_id=' + user.user_id);
        return of(null)
      }
      ));

    this.horasCombo = this.clase.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('combo-alumno?user_id=' + user['user_id'] + '&combo=' + user['combo']);
        return of(null)
      }
      ));
  }

  async pagarComboTieneHoras(claseD) {
    const user = await this.auth.getUserData();
    if (!user) {
      this.util.showMessage('No hemos podido tener los datos del usuario');
      return;
    }
    try {
      this.util.showLoading();
      const resp = await this.db.post('pagar-con-combo', { user_id: user.user_id, tarea_id: 0, clase_id: claseD.id, combo: claseD.combo })
      if (resp && resp.success)
        this.actualizar();
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }


  async pagarClaseConTransferencia(claseD) {
    const user = await this.auth.getUserData();
    if (!user) {
      this.util.showMessage('No hemos podido tener los datos del usuario');
      return;
    }
    const data = {
      combo_id: claseD.combo,
      user_id: user.user_id,
      tarea_id: 0,
      clase_id: claseD.id,
      archivo: 'noArchivo.png',
      drive: null,
      horas: claseD.horasCombo,
      valor: claseD.precioCombo
    };
    try {
      if (this.img.length > 0) {
        data['archivo'] = this.img[0].name;
        await this.upload.startUpload();
      }
      else {
        this.util.showMessage('Por favor adjuntar imagen de pago');
        return;
      }

      this.util.showLoading();
      const resp = await this.db.post('subir-transferencia', data);
      if (resp && resp.success)
        this.actualizar();
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async confirmarCancelar(clase) {
    if(!clase || clase == {})
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
        this.router.navigateByUrl('inicio');
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async subir() {
    try {
      this.upload.imagesSubject.subscribe(img => this.img = img);
      await this.upload.selectImage();
    } catch (error) {
    }
  }

  pagar(claseD, modo) {
    if (modo === 'transferencia') {
      this.router.navigateByUrl('clases-pagar', { queryParams: { clase: claseD } });
    } else {
      this.router.navigateByUrl('combos');
    }
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }

  async setDireccion(calle, referencia, preguntarPor, id) {
    console.log(calle);
    try {
      this.util.showLoading();
      const data = { clase_id: id, calle: calle, referencia: referencia, quien_preguntar: preguntarPor }
      const resp = await this.db.post('clase-confirmar', data);
      if (resp && resp.success)
        this.util.showMessage(resp.success);
      this.actualizar();
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }
}
