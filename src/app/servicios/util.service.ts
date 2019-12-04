import { Injectable } from '@angular/core';
import { ToastController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Location } from "@angular/common";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loading;
  temporalData;
  photo_url;
  esProfesor;

  constructor(
    public toastController: ToastController,
    public popoverController: PopoverController,
    private platform: Platform,
    private storage: Storage,
    public loadingController: LoadingController,
    private _navigation: Location,
    public alertController: AlertController
  ) { }

  async setEsProfesor(tipo: boolean) {
    this.esProfesor = tipo;
    console.log('esProfesor', this.esProfesor);
  }

  async showMessage(msg = '', showCloseButton = true, positionMsg = 'top', time = 5000, buttonText = 'Cerrar') {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: showCloseButton,
      position: 'top',
      duration: time,
      closeButtonText: buttonText,
      translucent: true
    });
    toast.present();
  }

  get photoUrl() {
    if (!this.photo_url)
      this.photo_url = environment.photo_url;
    return this.photo_url;
  }


  getSo() {
    if (this.platform.is('ios')) {
      return 'ios';
    } else
      return 'android';
  }

  async setStorage(key: string, val: any) {
    try {
      return this.storage.set(key, val);
    } catch (error) {
      return null;
    }
  }

  async getStorage(key: string) {
    try {
      return await this.storage.get(key);

    } catch (error) {
      return await null;
    }
  }

  async clearStorage() {
    try {
      return this.storage.clear();
    } catch (error) {
      return null;
    }
  }

  async removeStorage(key: string) {
    try {
      return await this.storage.remove(key);
    } catch (error) {
      return null;
    }
  }

  async showLoading(msg = 'Espere') {
    this.loading = await this.loadingController.create({
      message: msg,
      duration: 14000
    });
    await this.loading.present();

  }

  async dismissLoading() {
    try {
      await this.loading.dismiss();
    } catch (error) { }
  }

  isMobile() {
    return this.platform.is('cordova');
  }

  getColorEstado(estado) {
    switch (estado) {
      case 'Por pagar':
        return 'danger';

      case 'Confirmado':
        return 'success';

      case 'En proceso':
        return 'secondary';

      case 'Rechazado':
        return 'medium';

      case 'Cancelado':
        return 'medium';

      case 'Recibido':
        return 'medium';

      case 'Por confirmar':
        return 'danger';

      default:
        return 'primary';
    }
  }

  /**
   @param estado 4 estados:
      -Por pagar
      -Confirmado
      -Rechazado
      -En proceso
   */
  estados(estado, tarea?) {
    switch (estado) {
      case 'Sin_Horas':
        return 'Por pagar';

      case 'Solicitado':
        return this.esProfesor ? 'Por confirmar' : 'En proceso';

      case 'Confirmado':
        return this.esProfesor ? 'Por confirmar' : 'Por pagar';

      case 'Aceptado':
        return 'Confirmado';

      case 'Terminado':
        return tarea && this.esProfesor ? 'Terminada' : 'Recibido';

      case 'Calificado':
        return 'Confirmado';

      case 'Cancelado':
        return 'Cancelado';

      case 'Sin_Profesor':
        return 'Rechazado';

      case 'Sin_Pago':
        return 'Rechazado';

      case 'Pago_Rechazado':
        return 'Rechazado';

      case 'Confirmando_Pago':
        return this.esProfesor ? 'Por confirmar' : 'En proceso';

      default:
        return this.esProfesor ? 'Por confirmar' : 'En proceso';
    }
  }

  atras() {
    this._navigation.back();
  }

  async presentAlert(messageD, headerD, buttonsD = ['Aceptar'], subHeaderD?, cssClassD = 'notificacionStyle', show = true) {
    let configuracion = { message: messageD, buttons: buttonsD };

    if (headerD)
      configuracion['header'] = headerD;

    if (subHeaderD)
      configuracion['subHeader'] = subHeaderD;

    if (cssClassD)
      configuracion['cssClass'] = cssClassD;

    const alert = await this.alertController.create(configuracion);

    if (show)
      await alert.present();
    else
      return alert;
  }

  getTemporalData() {
    return this.temporalData;
  }

  setTemporalData(data) {
    this.temporalData = data;
  }
}
