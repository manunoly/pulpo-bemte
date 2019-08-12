import { AuthService } from './auth.service';
import { UtilService } from './util.service';
import { DbService } from './db.service';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { getToken } from '@angular/router/src/utils/preactivation';

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
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log(data);
        alert(data.body);
      };
    });
  }

  async actualizarToken(token?){
    if(!token){
      token = await this.getToken();
    }
    const so = this.util.getSo();
    const user = await this.auth.getUserData();
    await this.db.post('actualizar-token', { token: token, sistema: so, user_id: user.user_id });
  }
}
