import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  paso = 1;

  constructor(public alertController: AlertController) { }

  siguiente(paso = 1) {
    this.paso = paso;
  }

  async confirmar() {
    const alert = await this.alertController.create({
      header: 'Terminos y condiciones!',
      message: 'Si continuas aceptas los terminos!',
      buttons: [
        {
          text: 'Leer',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('leer terminos');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
}
