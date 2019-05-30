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

  async getSo() {
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

}
