import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilService } from '../servicios/util.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-ganancias-profesor',
  templateUrl: './ganancias-profesor.page.html',
  styleUrls: ['./ganancias-profesor.page.scss'],
})
export class GananciasProfesorPage implements OnInit {
  ganancias;
  tipo = 'CLASES';
  dataDetalles;
  ranking;
  
  constructor(private route: ActivatedRoute, public alertController: AlertController, public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.route.snapshot.paramMap.get("tipo"))
      this.tipo = this.route.snapshot.paramMap.get("tipo");
    this.cargarGanancias();
  }

  cargarGanancias() {
    this.ganancias = this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          if (this.util.esProfesor)
            this.db.get('profesor?user_id=' + user.user_id).then(resp => {
              this.ranking = resp;
            }).catch()
          return this.db.get('cuenta-profesor?user_id=' + user.user_id + '&tipo=' + this.tipo);
        }
        return of(null)
      }
      ));
  }

  setDetalles(id?) {
    if (id == this.dataDetalles)
      return this.dataDetalles = '';
    this.dataDetalles = id;
  }

  setTipo(tipo) {
    this.tipo = tipo;
    this.cargarGanancias();
    this.setDetalles(this.dataDetalles);
  }

}
