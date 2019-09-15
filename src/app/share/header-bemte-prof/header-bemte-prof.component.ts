import { UtilService } from './../../servicios/util.service';
import { AuthService } from './../../servicios/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-header-bemte-prof',
  templateUrl: './header-bemte-prof.component.html',
  styleUrls: ['./header-bemte-prof.component.scss'],
})
export class HeaderBemteProfComponent implements OnInit {
  estado = 'Disponible';
  estadoBoolean;
  user;

  constructor(private router: Router, private db: DbService, private auth: AuthService, private util: UtilService) { }

  async ngOnInit() {
    this.user = await this.auth.getUserData();
    // console.log('en el header del prof', this.user);
    if (this.user != undefined) {
      if (this.db.getEstadoProfesor() == undefined) {
        this.estadoBoolean = await this.db.get('disponible-profesor?user_id=' + this.user.user_id);
        this.db.setEstadoProfesor(this.estadoBoolean);
      } else
        this.estadoBoolean = this.db.getEstadoProfesor();
      if (this.estadoBoolean)
        this.estado = 'Disponible';
      else
        this.estado = 'Ocupado';
    }
  }


  goTo(url) {
    this.router.navigateByUrl(url);
  }

  async actualizarEstadoDB() {
    if (this.user == undefined)
      return;
    const dataPost = {
      user_id: this.user.user_id,
      disponible: this.estadoBoolean
    }
    const resp = await this.db.post('actualizar-disponible', dataPost);
    if (resp && resp.success) {
      this.util.showMessage(resp.success);
    }
  }

  actualizarEstado($event) {
    if ($event)
      this.estado = 'Disponible';
    else
      this.estado = 'Ocupado';

    this.db.setEstadoProfesor(this.estadoBoolean);
    this.actualizarEstadoDB();
  }
}
