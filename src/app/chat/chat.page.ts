import { DbService } from './../servicios/db.service';
import { UtilService } from './../servicios/util.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  clase;
  user
  chat;
  tarea;
  img;
  newMessage;

  constructor(private db: DbService, public util: UtilService, public auth: AuthService, private modalController: ModalController) { }

  ngOnInit() {
    console.log('recibo esto', this.clase);
    if (!this.clase) {
      this.util.showMessage('No hemos podido obtener los datos');
      setTimeout(() => {
        this.close()
      }, 1000);
      return;
    }
    this.cargarChat();
  }

  cargarChat() {
    this.chat = this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          let tareaid = '0';
          let claseid = '0';

          if (this.clase && this.clase.id)
            claseid = this.clase.id

          if (this.tarea && this.tarea.id)
            tareaid = this.tarea.id;

          return this.db.get('obtener-chat?user_id=' + user.user_id + '&tarea_id=' + tareaid + '&clase_id=' + claseid);
        }
        return of(null);
      }
      ));
  }

  enviarChat(textSend = null) {
    let tareaid = '0';
    let claseid = '0';

    if (this.clase && this.clase.id)
      claseid = this.clase.id

    if (this.tarea && this.tarea.id)
      tareaid = this.tarea.id;

    this.db.post('enviar-chat', {
      user_id: this.user.user_id,
      tarea_id: tareaid,
      clase_id: claseid,
      texto: textSend,
      img: this.img
    }).then(_ => this.cargarChat()).catch(_ => this.cargarChat())
  }

  close() {
    this.modalController.dismiss();
  }

}
