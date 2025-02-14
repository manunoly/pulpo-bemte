import { Router } from '@angular/router';
import { FcmService } from "./../servicios/fcm.service";
import { DbService } from "./../servicios/db.service";
import { AuthService } from "./../servicios/auth.service";
import { Component, OnInit } from "@angular/core";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { UtilService } from "../servicios/util.service";

@Component({
  selector: "app-inicio-profesor",
  templateUrl: "./inicio-profesor.page.html",
  styleUrls: ["./inicio-profesor.page.scss"]
})
export class InicioProfesorPage implements OnInit {
  tipo = "clases";
  detallesTareaId;
  detallesClaseId;
  clases;
  tareas;
  reload;

  constructor(
    public auth: AuthService,
    public db: DbService,
    public util: UtilService,
    private fcm: FcmService,
    private router: Router,
    // private modalController: ModalController
  ) { }

  async ngOnInit() {
    if (this.util.isMobile()) {
      try {
        const user = await this.auth.getUserData();
        if (user) {
          if (!user.token || user.token != (await this.fcm.getToken()))
            this.fcm.actualizarToken();

        }
      } catch (error) { }
    }
  }

  ionViewWillEnter() {
    this.cargarClases();
    this.cargarTareas();
    this.reload = true;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.util.getStorage('chat').then(chat => {
        console.log('chat en el getStorage inicio', chat);
        if (chat) {
          this.db.newChat$.next(JSON.parse(chat));
          this.router.navigateByUrl('chat/1/1');
        }
      }).catch(_ => { })
    }, 500);
  }

  ionViewDidLeave() {
    this.reload = false;
  }

  setDetallesTareaId(id) {
    if (id == this.detallesTareaId) return (this.detallesTareaId = "");
    this.detallesTareaId = id;
  }

  alertaAplicada() {
    this.util.presentAlert('Usted ya ha aplicado a esta tarea', 'Información', undefined, '', 'fondoAzul alertDefaultBotonVerde');
  }

  setDetallesClaseId(id) {
    if (id == this.detallesClaseId) return (this.detallesClaseId = "");
    this.detallesClaseId = id;
  }

  setTipo(tipo) {
    this.tipo = tipo;
    if (this.tipo == "clases") {
      this.cargarClases();
    } else if (this.tipo == "tareas") {
      this.cargarTareas();
    }
  }

  async cargarClases() {
    this.clases = this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          return this.db.get("clases-disponibles?user_id=" + user.user_id);
        }
        return of(null);
      })
    );
  }

  cargarTareas() {
    this.tareas = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get("tareas-disponibles?user_id=" + user.user_id);
        return of(null);
      })
    );
  }

  async actualizar(event) {
    this.reload = false;
    this.setTipo(this.tipo);
    setTimeout(() => {
      this.reload = true;
      event.target.complete();
    }, 1000);

  }
}
