import { Injectable } from '@angular/core';
import { ToastController, Platform, LoadingController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loading;

  constructor(
    public toastController: ToastController,
    public popoverController: PopoverController,
    private platform: Platform,
    private storage: Storage,
    public loadingController: LoadingController
  ) { }

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
        return 'primary';

      case 'En proceso':
        return 'secondary';

      case 'Rechazado':
        return 'medium';

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
  estados(estado) {
    switch (estado) {
      case 'Sin_Horas':
        return 'Por pagar';

      case 'Solicitado':
        return 'En proceso';

      case 'Confirmado':
        return 'Por pagar';

      case 'Aceptado':
        return 'Confirmado';

      case 'Terminado':
        return 'Confirmado';

      case 'Calificado':
        return 'Confirmado';

      case 'Cancelado':
        return 'Rechazado';

      case 'Sin_Profesor':
        return 'Rechazado';

      case 'Sin_Pago':
        return 'Rechazado';

      case 'Pago_Rechazado':
        return 'Rechazado';

      case 'Confirmando_Pago':
        return 'En proceso';

      default:
        return 'En proceso';
    }
  }
}
