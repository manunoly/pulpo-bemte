import { DbService } from 'src/app/servicios/db.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { TerminosPage } from '../login/terminos/terminos.page';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(public auth: AuthService, private modalController: ModalController, private db: DbService) { }

  ngOnInit() {
  }

  async confirmarTerminos() {

    const modal = await this.modalController.create({
      component: TerminosPage
    });

    return await modal.present();
  }

  async openVideo() {
    const video = await this.db.get('video');
    console.log(video);
    window.location.assign('https://youtube.com');
  }

}
