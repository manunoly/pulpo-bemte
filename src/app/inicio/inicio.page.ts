import { UtilService } from "src/app/servicios/util.service";
import { FcmService } from "./../servicios/fcm.service";
import { AuthService } from "./../servicios/auth.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

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
    public auth: AuthService
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

  async actualizar(event) {
    this.reload = false;
    setTimeout(() => {
      this.reload = true;
      event.target.complete();
    }, 600);

  }

}
