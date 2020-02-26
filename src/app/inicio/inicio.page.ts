import { DbService } from 'src/app/servicios/db.service';
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
  chat;

  constructor(
    public util: UtilService,
    private fcm: FcmService,
    private router: Router,
    public auth: AuthService,
    private db: DbService
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
