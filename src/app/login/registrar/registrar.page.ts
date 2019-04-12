import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  constructor(public alertController: AlertController) { }

  ngOnInit() {
  }
  paso = 1;


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
