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
    private db: DbService,
    public util: UtilService,
    private fcm: FcmService
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

  ionViewDidLeave() {
    this.reload = false;
  }

  setDetallesTareaId(id) {
    if (id == this.detallesTareaId) return (this.detallesTareaId = "");
    this.detallesTareaId = id;
  }

  setDetallesClaseId(id) {
    if (id == this.detallesClaseId) return (this.detallesClaseId = "");
    this.detallesClaseId = id;
  }

  setTipo(tipo) {
    this.tipo = tipo;
    if (this.tipo == "clases") {
      this.cargarClases();
    } else if (this.tipo == "clases") {
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
