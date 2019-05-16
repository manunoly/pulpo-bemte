import { UtilService } from './util.service';
import { DbService } from './db.service';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { getToken } from '@angular/router/src/utils/preactivation';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private fcm: FCM, private db: DbService, private util: UtilService) {
    this.fcm.subscribeToTopic('bemteAll');
    this.refresToken();
    this.manejarNotificacion();
  }

  async getToken() {
    return await this.fcm.getToken();
  }

  async manejarNotificacion() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    });
  }

  async refresToken() {
    this.fcm.onTokenRefresh().subscribe(async (token) => {
      const so = this.util.getSo();
      await this.db.post('actualizar-token', { token: token, so: so });
    });
  }
}
