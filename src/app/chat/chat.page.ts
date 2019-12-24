import { UploadService } from './../servicios/upload.service';
import { UploadFileImageService } from './../service/upload-file-image.service';
import { DbService } from './../servicios/db.service';
import { UtilService } from './../servicios/util.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  clase;
  user
  chatD;
  tarea;
  img = [];
  fichero;
  newMessage;
  @ViewChild('content') private content: any;
  $counter;
  cant = 0;
  datosMostrar;
  tipo;

  constructor(private alertController: AlertController, private db: DbService,
    public upload: UploadService, private iab: InAppBrowser,
    private uploadFile: UploadFileImageService, public util: UtilService,
    public auth: AuthService, private modalController: ModalController) { }

  async ngOnInit() {
    console.log('recibo clase', this.clase);
    console.log('recibo tarea', this.tarea);
    console.log('tipo', this.tipo);
    if (!this.clase && !this.tarea) {
      this.util.showMessage('No hemos podido obtener los datos');
      setTimeout(() => {
        this.close()
      }, 1000);
      return;
    }
    this.user = await this.auth.getUserData();
    this.cargarChat();
    this.recargarChatAutomatico();
  }

  ionViewDidLeave() {
    this.$counter.unsubscribe();
    if (this.img && this.img.length > 0)
      this.upload.deleteImage(this.img[0]);
    if (this.fichero)
      this.fichero = '';
  }

  recargarChatAutomatico() {
    this.$counter = interval(10000).pipe(
      switchMap(() => this.cargarChat())
    ).subscribe();
  }

  async cargarChat() {
    if (this.user) {
      let tareaid = '0';
      let claseid = '0';

      if (this.clase && this.clase.id) {
        claseid = this.clase.id
        this.datosMostrar = this.clase;
        this.tipo = ' CLASE';
      }

      if (this.tarea && this.tarea.id) {
        tareaid = this.tarea.id;
        this.datosMostrar = this.tarea;
        this.tipo = ' TAREA';
      }

      const chats = await this.db.get('obtener-chat?user_id=' + this.user.user_id + '&tarea_id=' + tareaid + '&clase_id=' + claseid);
      this.scrollToBottomOnInit(chats);
    }
  }



  async scrollToBottomOnInit(chats) {
    if (this.cant != chats.length) {
      this.chatD = chats;
      // this.chatD = chats.slice().reverse();
      this.cant = this.chatD.length;
      this.content.scrollToBottom(100);
    }
  }


  async enviarChat(adj?) {

    if (!adj && (this.fichero || this.img.length > 0)) {
      return this.confirmaEnviarArchivo();
    }


    let tareaid = '0';
    let claseid = '0';

    if (this.clase && this.clase.id)
      claseid = this.clase.id

    if (this.tarea && this.tarea.id)
      tareaid = this.tarea.id;

    let imgData = null;
    if (this.fichero) {
      imgData = this.fichero.get('filename');
    }
    if (this.img && this.img.length > 0) {
      imgData = this.img[0].name;
    }
    await this.db.post('enviar-chat', {
      user_id: this.user.user_id,
      tarea_id: tareaid,
      clase_id: claseid,
      texto: this.newMessage,
      imagen: imgData
    });

    await this.cargarChat();
    return true;
  }

  close() {
    this.modalController.dismiss();
  }


  async terminar() {
    try {
      this.util.showLoading();
      const resp = await this.db.post('tarea-terminar', { clase_id: 0, tarea_id: this.tarea.id, user_id: this.user.user_id, cancelar: 0, profesor: 0 });
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.close();
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async finalizarTarea() {
    {
      let tipo = 'Profesor';
      if (this.user.tipo == 'Profesor')
        tipo = 'Estudiante'
      const alert = await this.alertController.create({
        header: 'Finalizar la tarea!',
        message: `Al finalizar la tarea, se finaliza tambien el contacto con el ${tipo}.`,
        cssClass: 'fondoVerde alertDefault',
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
        buttons: [
          {
            text: 'Atrás',
            role: 'cancel',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Aceptar',
            handler: (data) => {
              if (data) {
                this.terminar();
              }
            }
          }
        ]
      });

      await alert.present();
    }

  }

  async seleccionarArchivo() {
    this.fichero = await this.uploadFile.selectFile();
    if (this.fichero)
      this.confirmaEnviarArchivo();
  }

  async seleccionarFoto() {
    try {
      this.upload.imagesSubject.subscribe(img => {
        this.img = img;
        console.log(this.img);
        if (this.img && this.img.length > 0)
          this.confirmaEnviarArchivo();
      });
      await this.upload.selectImage();
    } catch (error) {
    }
  }

  async confirmaEnviarArchivo() {
    {
      let tipo = 'Profesor';
      if (this.user.tipo == 'Profesor')
        tipo = 'Estudiante'
      const alert = await this.alertController.create({
        header: 'Confirme acción!',
        message: `Confirme desea enviar archivo o eliminarlo`,
        cssClass: 'fondoVerde alertDefault',
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
        buttons: [
          {
            text: 'Eliminar',
            role: 'cancel',
            handler: (data) => {
              if (data) {
                if (this.fichero) {
                  this.fichero = '';
                }
                if (this.img && this.img.length > 0) {
                  this.upload.deleteImage(this.img[0]);
                }
              }
            }
          }, {
            text: 'Enviar',
            handler: async (data) => {
              if (data) {
                if (this.fichero) {
                  await this.uploadFile.uploadImageData(this.fichero);
                  await this.enviarChat(true);
                  this.fichero = '';
                }
                if (this.img && this.img.length > 0) {
                  await this.upload.startUpload(this.img[0]);
                  await this.enviarChat(true);
                  this.upload.deleteImage(this.img[0]);
                }
              }
            }
          }
        ]
      });

      await alert.present();
    }
  }


  downloadFile(url) {
    this.iab.create(this.db.photoUrl + url, '_system');
  }

}
