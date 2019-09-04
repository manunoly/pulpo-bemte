import { UtilService } from "src/app/servicios/util.service";
import { FcmService } from "./../servicios/fcm.service";
import { ModalController } from "@ionic/angular";
import { AuthService } from "./../servicios/auth.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { MapPage } from "../map/map.page";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.page.html",
  styleUrls: ["./inicio.page.scss"]
})
export class InicioPage implements OnInit {
  reload = true;

  constructor(
    public util: UtilService,
    private fcm: FcmService,
    private router: Router,
    public auth: AuthService,
    private modalController: ModalController
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
    this.reload = true;
  }
  
  ionViewDidLeave() {
    this.reload = false;
  }

  goTo(url) {
    this.router.navigateByUrl(url);
  }

  async map() {
    const modal = await this.modalController.create({
      component: MapPage
      // componentProps: { ubicacion: { lat: -0.1740159, lng: -78.463816299 } }
    });
    modal.onDidDismiss().then(data => console.log(data));
    return await modal.present();
  }

  accionHoras($event) {
    console.log($event);
  }
}
