import { DbService } from './../../servicios/db.service';
import { ModalController } from '@ionic/angular';
import { UtilService } from './../../servicios/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
})
export class TerminosPage implements OnInit {
  terminos;


  constructor(private modalController: ModalController, private db: DbService) { }

  async ngOnInit() {
    this.terminos = await this.db.get('reglamento');
  }

  back(ok?) {
    this.modalController.dismiss(ok);
  }

}
