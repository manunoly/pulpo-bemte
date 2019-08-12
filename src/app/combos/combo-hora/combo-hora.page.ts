import { AuthService } from "./../../servicios/auth.service";
import { UploadService } from "./../../servicios/upload.service";
import { DbService } from "./../../servicios/db.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { UtilService } from "src/app/servicios/util.service";
import { Location } from "@angular/common";
import { first } from "rxjs/operators";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-combo-hora",
  templateUrl: "./combo-hora.page.html",
  styleUrls: ["./combo-hora.page.scss"]
})
export class ComboHoraPage implements OnInit {
  combo;
  horas;
  horaSeleccionada;
  confirmar = false;
  pagarCombo;
  img;

  constructor(
    public auth: AuthService,
    public upload: UploadService,
    private router: Router,
    private navigation: Location,
    private route: ActivatedRoute,
    private util: UtilService,
    private db: DbService
  ) {}

  async ngOnInit() {
    const param = this.route.snapshot.paramMap.get("combo");
    if (!param) {
      this.util.showMessage(
        "No se ha podido obtener los datos del combo el combo"
      );
    } else this.combo = param;
    this.horas = this.db.get("combo-horas?combo=" + this.combo);
  }

  confirmarHora() {
    let combo = this.db.getComboToBuy();
    if (!combo) {
      this.pagarCombo = true;
      return;
    }
    combo["combo"] = this.combo;
    combo["horas"] = this.horaSeleccionada.hora;
    combo["precio"] = this.horaSeleccionada.inversion;
    this.db.setComboToBuy(combo);
    if (combo["type"] && combo["type"] == "tareas") this.pagarCombo = true;
    else
      this.router.navigateByUrl("clases", {
        queryParams: { hora: this.horaSeleccionada, combo: this.combo }
      });
  }

  async pagarComboConTransferencia() {
    const user = await this.auth.getUserData();
    if (!user) {
      this.util.showMessage("No hemos podido tener los datos del usuario");
      return;
    }
    let combo = {};
    combo["combo"] = this.combo;
    combo["horas"] = this.horaSeleccionada.hora;
    combo["precio"] = this.horaSeleccionada.inversion;
    const data = {
      combo_id: this.combo,
      user_id: user.user_id,
      tarea_id: 0,
      clase_id: 0,
      drive: null,
      horas: combo["horas"],
      valor: combo["precio"]
    };
    try {
      if (this.img.length > 0) {
        data["archivo"] = this.img[0].name;
        await this.upload
          .startUpload()
          .then(async respImagen => {
            this.util.showLoading();
            const resp = await this.db.post("subir-transferencia", data);
            this.util.dismissLoading();
            if (resp && resp.success) {
              this.util.showMessage(resp.success);
              setTimeout(() => {
                this.router.navigateByUrl("inicio");
              }, 2000);
            }
          })
          .catch(error => {
            this.util.showMessage(
              "Ha ocurrido un error inesperado al subir la transferencia"
            );
          });
      } else {
        this.util.showMessage("Por favor adjuntar imagen de pago");
        return;
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  atras() {
    this.navigation.back();
  }

  async subir() {
    try {
      await this.upload.selectImage();
      this.upload.imagesSubject.subscribe(img => (this.img = img));
    } catch (error) {}
  }

  async comprarCombo() {
    let data;
    try {
      if (this.img.length > 0) {
        data["archivo"] = this.img[0].name;
        await this.upload
          .startUpload()
          .then(resp => {})
          .catch(error => {
            this.util.showMessage("Ha ocurrido un error inesperado");
          });
      } else {
        this.util.showMessage("Por favor adjuntar imagen de pago");
        return;
      }
    } catch (error) {
      console.log(error);
      this.util.showMessage("Ha ocurrido un error inesperado");
    }
  }
}
