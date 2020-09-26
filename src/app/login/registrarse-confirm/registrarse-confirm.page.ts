import { UtilService } from './../../servicios/util.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DbService } from './../../servicios/db.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrarse-confirm',
  templateUrl: './registrarse-confirm.page.html',
  styleUrls: ['./registrarse-confirm.page.scss'],
})
export class RegistrarseConfirmPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private db: DbService,
    private iab: InAppBrowser,
    private util: UtilService
  ) {}

  ngOnInit() {}

  async leer() {
    this.util.showLoading();
    const data = await this.db.get('reglamento');

    if (!data || !data.reglamentoUrl) return;
    this.iab.create(data.reglamentoUrl, '_system');
    this.util.dismissLoading();
  }

  back(ok?) {
    this.modalController.dismiss(ok);
  }
}
