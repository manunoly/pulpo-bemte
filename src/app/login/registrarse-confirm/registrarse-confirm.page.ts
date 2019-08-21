import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrarse-confirm',
  templateUrl: './registrarse-confirm.page.html',
  styleUrls: ['./registrarse-confirm.page.scss'],
})
export class RegistrarseConfirmPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  back(ok?) {
    this.modalController.dismiss(ok);

  }
}
