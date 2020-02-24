import { Component, OnInit, Input } from '@angular/core';
import { ChatPage } from './../../chat/chat.page';
import { ModalController } from '@ionic/angular';
import { AuthService } from './../../servicios/auth.service';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-header-bemte',
  templateUrl: './header-bemte.component.html',
  styleUrls: ['./header-bemte.component.scss'],
})
export class HeaderBemteComponent implements OnInit {
  public notificion;
  @Input() popup = false;
  @Input() chatPage = false;
  chat;

  constructor(private router: Router, public db: DbService, private auth: AuthService, private modalController: ModalController) { }

  async ngOnInit() {
    this.db.newChat$.subscribe(chat => this.chat = chat);

    const user = await this.auth.getUserData();

    this.db.get('nueva-notificacion?user_id=' + user.user_id)
      .then(not => {
        this.db.setEstadoNotificacion(not); this.notificion = this.db.getEstadoNotificacion();
      }).catch();

    // setTimeout(() => {
    //   let newChat = {};
    //   newChat['tarea_id'] = '0';
    //   newChat['clase_id'] = '355';

    //   this.db.newChat$.next(newChat);
    // }, 3000);
  }

  descartarChat() {
    this.db.newChat$.next(false);
  }

  goTo(url) {
    if (this.popup)
      this.modalController.dismiss();
    this.router.navigateByUrl(url);
  }
}
