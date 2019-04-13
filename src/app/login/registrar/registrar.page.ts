import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  constructor(public alertController: AlertController, private router: Router) { }

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
            this.router.navigateByUrl('home');

          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
            this.router.navigateByUrl('home');

          }
        }
      ]
    });

    await alert.present();
  }
}
