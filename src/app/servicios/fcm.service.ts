import { AuthService } from './auth.service';
import { UtilService } from './util.service';
import { DbService } from './db.service';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private fcm: FCM, private db: DbService, private util: UtilService, private auth: AuthService) {
    this.fcm.subscribeToTopic('bemteAll');
    this.manejarNotificacion();
    this.fcm.onTokenRefresh().subscribe(async (token) => {
      await this.actualizarToken(token);
    });
  }

  async getToken() {
    return await this.fcm.getToken();
  }

  async manejarNotificacion() {
    this.fcm.onNotification().subscribe(data => {
      console.log('nueva notificacion', data);
      if (data.wasTapped) {
        if (data && data.chat && data.chat == "true") {
          let newChat = {};
          newChat['tarea_id'] = data.tarea_id ? data.tarea_id : '0';
          newChat['clase_id'] = data.clase_id ? data.clase_id : '0';

          this.util.setStorage('chat', JSON.stringify(newChat))
            .then(resp => console.log('escribiendo el chat respuesta', resp))
            .catch(error => console.log('error escribiendo el chat'));
          this.db.newChat$.next(newChat);

          console.log('debi escribir este chat al hacer click', newChat);
        }
      } else {
        if (data && data.chat && data.chat == "true") {
          let msg = 'Nuevo Mensaje en el Chat';
          this.util.showMessage(data.body ? data.title + ': ' + data.body : msg);
          let newChat = {};
          newChat['tarea_id'] = data.tarea_id ? data.tarea_id : '0';
          newChat['clase_id'] = data.clase_id ? data.clase_id : '0';

          this.db.newChat$.next(newChat);

        } else {
          let style = ' alertDefault';
          if (data && data.color)
            style = data.color + style;
          else
            style = 'fondoDeault alertDefault';

          this.util.presentAlert(data && data.body ? data.body : data.title, data.title ? data.title : 'Información', undefined, undefined, style);
        }
      };
    });
  }

  async actualizarToken(token?) {
    if (!token) {
      token = await this.getToken();
    }
    const so = this.util.getSo();
    const user = await this.auth.getUserData();
    await this.db.post('actualizar-token', { token: token, sistema: so, user_id: user.user_id });
  }
}
