import { Component, OnInit } from '@angular/core';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import { of } from 'rxjs';

@Component({
  selector: 'app-lista-clases',
  templateUrl: './lista-clases.page.html',
  styleUrls: ['./lista-clases.page.scss'],
})
export class ListaClasesPage implements OnInit {
  clases;

  constructor(public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  async ngOnInit() {
    this.clases = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('lista-clases?user_id=' + user.user_id)
        return of(null)
      }
      ));

    // this.tareas.subscribe(arg => console.log(arg));

  }

}
