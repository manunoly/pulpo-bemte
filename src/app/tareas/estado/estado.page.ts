import { AlertController } from '@ionic/angular';
import { UploadService } from './../../servicios/upload.service';
import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.page.html',
  styleUrls: ['./estado.page.scss'],
})
export class EstadoPage implements OnInit {
  tarea;
  user;
  transferencia;
  comboPago;
  comboHoras;

  constructor(private alertController: AlertController, public upload: UploadService, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  async ngOnInit() {
    this.actualizar();
  }

  async actualizar() {
    this.tarea = this.auth.user.pipe(
      switchMap(user => {
        this.user = user;
        if (user)
          return this.db.get('tarea-activa?user_id=' + user.user_id)
        return of(null)
      }
      ));

    this.comboHoras = this.auth.user.pipe(
      switchMap(user => {
        this.user = user;
        if (user)
          return this.db.get('horas-totales?user_id=' + user.user_id)
        return of(null)
      }
      ));
    // this.tarea = this.db.get('tarea-activa?user_id=' + this.user.user_id);
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

  pagar(tareaD, modo, dataO) {
    console.log(dataO);
    let combo = this.db.getComboToBuy();
    if (!combo)
      combo = {};
    combo['data'] = dataO;
    combo['type'] = 'tareas'
    combo['id'] = tareaD;
    this.db.setComboToBuy(combo);
    this.router.navigateByUrl(modo);
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }

  async pagarTareaConCombo(tareaD) {
    const user = await this.auth.getUserData();
    if (!user) {
      this.util.showMessage('No hemos podido tener los datos del usuario');
      return;
    }
    try {
      this.util.showLoading();
      const resp = await this.db.post('pagar-con-combo', { user_id: user.user_id, tarea_id: tareaD.id, clase_id: 0, combo: 0 })
      if (resp && resp.success)
        this.actualizar();
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async comprarCombos(tareaD){
    let combo = this.db.getComboToBuy();
    if (!combo)
      combo = {};
    combo['data'] = tareaD;
    combo['type'] = 'tareas'
    combo['id'] = tareaD.id;
    this.db.setComboToBuy(combo);
    this.router.navigateByUrl('combos');
  }

  async pagarTareaConTransferencia(tareaD) {
    const user = await this.auth.getUserData();
    if (!user) {
      this.util.showMessage('No hemos podido tener los datos del usuario');
      return;
    }
    const data = {
      combo_id: 0,
      user_id: user.user_id,
      tarea_id: tareaD.id,
      clase_id: 0,
      archivo: 'noArchivo.png',
      drive: null
    };
    try {
      this.util.showLoading();
      const resp = await this.db.post('subir-transferencia', data);
      if (resp && resp.success)
        this.actualizar();
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async subir() {
    try {
      await this.upload.selectImage();
      // this.img = await this.upload.loadStoredImages();
    } catch (error) {
    }
  }

}
