import { ModalController, AlertController } from '@ionic/angular';
import { UtilService } from './../../servicios/util.service';
import { AuthService } from './../../servicios/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-header-bemte-prof',
  templateUrl: './header-bemte-prof.component.html',
  styleUrls: ['./header-bemte-prof.component.scss'],
})
export class HeaderBemteProfComponent implements OnInit {
  estado = 'Disponible';
  estadoBoolean;
  user;
  public notificion;
  @Input() popup = false;
  @Input() chatPage = false;
  chat;
  
  constructor(private router: Router,
    private alertController: AlertController,
    private db: DbService, private auth: AuthService, private util: UtilService, private modalController: ModalController) { }

  async ngOnInit() {
    this.db.newChat$.subscribe(chat => this.chat = chat);

    this.user = await this.auth.getUserData();
    // console.log('en el header del prof', this.user);

    if (this.user != undefined) {
      this.db.get('nueva-notificacion?user_id=' + this.user.user_id)
        .then(not => {
          this.db.setEstadoNotificacion(not); this.notificion = this.db.getEstadoNotificacion();
        }).catch();
      if (this.db.getEstadoProfesor() == undefined) {
        this.estadoBoolean = await this.db.get('disponible-profesor?user_id=' + this.user.user_id);
        this.db.setEstadoProfesor(this.estadoBoolean);
      } else
        this.estadoBoolean = this.db.getEstadoProfesor();
      if (this.estadoBoolean)
        this.estado = 'Disponible';
      else
        this.estado = 'Ocupado';
    }
  }


  goTo(url) {
    if (this.popup)
      this.modalController.dismiss();
    this.router.navigateByUrl(url);
  }

  descartarChat() {
    this.db.newChat$.next(false);
  }

  async actualizarEstadoDB() {
    if (this.user == undefined)
      return;
    const dataPost = {
      user_id: this.user.user_id,
      disponible: this.estadoBoolean
    }
    const resp = await this.db.post('actualizar-disponible', dataPost);
    if (resp && resp.success) {
      this.util.showMessage(resp.success);
    }
  }

  async actualizarEstado($event) {
    if ($event) {
      if (this.db.getEstadoProfesor() != $event) {
        this.db.setEstadoProfesor(this.estadoBoolean);
        this.actualizarEstadoDB();
      }
      this.estado = 'Disponible';
    }
    else {
      const alert = await this.alertController.create({
        header: 'No tendrás ganancias!',
        subHeader: '¿Estas seguro?',
        inputs: [
          {
            name: 'Si',
            type: 'radio',
            label: 'Si',
            value: true
          },
          {
            name: 'No',
            type: 'radio',
            label: 'No',
            value: false
          }],
        cssClass: 'fondoRojo alertRojo',
        buttons: [{
          text: 'Aceptar',
          handler: (data) => {
            console.log(data);
            if (data) {
              this.db.setEstadoProfesor(this.estadoBoolean);
              this.actualizarEstadoDB();
            } else {
              this.estado = 'Disponible';
              this.estadoBoolean = true;
            }
          }
        }
        ]
      });

      await alert.present();
      const dismiss = await alert.onDidDismiss();
      if (dismiss.data == undefined && dismiss.role == "backdrop") {
        this.estado = 'Disponible';
        this.estadoBoolean = true;
      }
    }


  }
}
