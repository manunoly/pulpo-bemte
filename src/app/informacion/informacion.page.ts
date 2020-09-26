import { UtilService } from 'src/app/servicios/util.service';
import { DbService } from 'src/app/servicios/db.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { TerminosPage } from '../login/terminos/terminos.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(public auth: AuthService, private modalController: ModalController, private db: DbService, private util: UtilService,
    private iab: InAppBrowser) { }

  ngOnInit() {
  }

  async confirmarTerminos() {
      this.util.showLoading();
      const terminos = await this.db.get('reglamento');
  
      if (!terminos || !terminos.reglamentoUrl) return;
      this.iab.create(terminos.reglamentoUrl, '_system');
      this.util.dismissLoading();
  }

  async openVideo() {
    this.util.showLoading();
    const data = await this.db.get('video');

    if (!data || !data.videoUrl) return;
    this.iab.create(data.videoUrl, '_system');
    this.util.dismissLoading();
  }

}
