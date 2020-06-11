import { UploadService } from './../servicios/upload.service';
import { UploadFileImageService } from './../service/upload-file-image.service';
import { DbService } from './../servicios/db.service';
import { UtilService } from './../servicios/util.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';
import { interval } from 'rxjs';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  clase;
  user;
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
  nomodal;

  constructor(
    private alertController: AlertController,
    private db: DbService,
    public upload: UploadService,
    private iab: InAppBrowser,
    private uploadFile: UploadFileImageService,
    public util: UtilService,
    public auth: AuthService,
    private sanitizer: DomSanitizer,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.user = await this.auth.getUserData();

    this.db.newChat$.pipe(take(1)).subscribe(async (chat) => {
      if (chat && !this.clase && !this.tarea) {
        this.nomodal = true;
        try {
          this.util.showLoading();
          if (chat.tarea_id && chat.tarea_id != '0') {
            this.tarea = await this.db.get(
              'devuelve-tarea?tarea_id=' + chat.tarea_id
            );
            // this.tarea = chat;
            // this.tarea['id'] = chat.tarea_id;
          } else {
            if (chat.clase_id && chat.clase_id != '0') {
              this.clase = await this.db.get(
                'devuelve-clase?clase_id=' + chat.clase_id
              );
              // this.clase = chat;
              // this.clase['id'] = chat.clase_id;
            }
          }
          this.util.dismissLoading();
        } catch (error) {
          this.util.dismissLoading();
        }
      }

      console.log('recibo clase', this.clase);
      console.log('recibo tarea', this.tarea);
      console.log('tipo', this.tipo);
      if (!this.clase && !this.tarea) {
        this.util.showMessage('No hemos podido obtener los datos');
        setTimeout(() => {
          this.close();
        }, 1000);
        return;
      }
      this.cargarChat();
      this.recargarChatAutomatico();
    });
  }

  ionViewDidLeave() {
    this.util.removeStorage('chat');
    this.db.newChat$.next(null);
    if (this.$counter) this.$counter.unsubscribe();

    if (this.img && this.img.length > 0) this.upload.deleteImage(this.img[0]);
    if (this.fichero) this.fichero = '';
  }

  recargarChatAutomatico() {
    this.$counter = interval(6000)
      .pipe(switchMap(() => this.cargarChat()))
      .subscribe();
  }

  async cargarChat() {
    if (this.user) {
      let tareaid = '0';
      let claseid = '0';

      if (this.clase && this.clase.id) {
        claseid = this.clase.id;
        this.datosMostrar = this.clase;
        this.tipo = ' CLASE';
      }

      if (this.tarea && this.tarea.id) {
        tareaid = this.tarea.id;
        this.datosMostrar = this.tarea;
        this.tipo = ' TAREA';
      }

      const chats = await this.db.get(
        'obtener-chat?user_id=' +
          this.user.user_id +
          '&tarea_id=' +
          tareaid +
          '&clase_id=' +
          claseid
      );
      this.scrollToBottomOnInit(chats);
      return;
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
    this.util.showLoading();
    let tareaid = '0';
    let claseid = '0';

    if (this.clase && this.clase.id) claseid = this.clase.id;

    if (this.tarea && this.tarea.id) tareaid = this.tarea.id;

    let imgData = null;
    if (this.fichero) {
      imgData = this.fichero.get('filename');
    }

    if (this.img && this.img.length > 0) {
      imgData = this.img[0].name;
    }

    try {
      await this.db.post('enviar-chat', {
        user_id: this.user.user_id,
        tarea_id: tareaid,
        clase_id: claseid,
        texto: this.newMessage,
        imagen: imgData,
      });
    } catch (error) {}
    this.newMessage = '';
    await this.cargarChat();
    this.util.dismissLoading();
    return true;
  }

  close() {
    if (this.nomodal) return this.util.atras();
    this.modalController.dismiss();
  }

  async terminar() {
    try {
      this.util.showLoading();
      const resp = await this.db.post('tarea-terminar', {
        clase_id: 0,
        tarea_id: this.tarea.id,
        user_id: this.user.user_id,
        cancelar: 0,
        profesor: 0,
      });
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        if (this.nomodal) return this.util.atras();
        this.modalController.dismiss({ terminar: true });
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async finalizarTarea() {
    {
      let tipo = 'Profesor';
      if (this.user.tipo == 'Profesor') tipo = 'Estudiante';
      const alert = await this.alertController.create({
        header: 'Finalizar la tarea!',
        message: `Al finalizar la tarea, se finaliza tambien el contacto con el ${tipo}. <br> ¿Estas seguro que deseas finalizar?`,
        cssClass: 'fondoVerde alertDefault',
        inputs: [
          {
            name: 'Si',
            type: 'radio',
            label: 'Si',
            value: true,
          },
          {
            name: 'No',
            type: 'radio',
            label: 'No',
            value: false,
          },
        ],
        buttons: [
          {
            text: 'Atrás',
            role: 'cancel',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            },
          },
          {
            text: 'Aceptar',
            handler: (data) => {
              if (data) {
                this.terminar();
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  async seleccionarArchivo() {
    this.fichero = await this.uploadFile.selectFile();
  }

  async seleccionarFoto() {
    try {
      this.upload.imagesSubject.subscribe((img) => {
        this.img = img;
      });
      await this.upload.selectImage();
    } catch (error) {}
  }

  async confirmaEnviarArchivo() {
    {
      if (!this.fichero && this.img.length == 0) {
        return this.enviarChat();
      }

      const alert = await this.alertController.create({
        header: 'Confirme acción!',
        message: `Confirme desea enviar archivo o eliminarlo`,
        cssClass: 'fondoVerde alertDefault',
        inputs: [
          {
            name: 'Si',
            type: 'radio',
            label: 'Si',
            value: true,
          },
          {
            name: 'No',
            type: 'radio',
            label: 'No',
            value: false,
          },
        ],
        buttons: [
          {
            text: 'Eliminar',
            handler: (data) => {
              console.log(data);
              if (data) {
                if (this.fichero) {
                  this.fichero = '';
                }
                if (this.img && this.img.length > 0) {
                  this.upload.deleteImage(this.img[0]);
                }
              }
            },
          },
          {
            text: 'Enviar',
            handler: async (data) => {
              if (data) {
                if (this.fichero) {
                  await this.uploadFile.uploadImageData(this.fichero);
                  setTimeout(async () => {
                    await this.enviarChat(true);
                    this.fichero = '';
                  }, 1700);
                } else if (this.img && this.img.length > 0) {
                  await this.upload.startUpload(this.img[0]);
                  setTimeout(async () => {
                    await this.enviarChat(true);
                  }, 1700);
                }
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  downloadFile(url) {
    this.iab.create(this.db.photoUrl + url, '_system');
  }

  openLink(evt) {
    const href = evt.target.getAttribute('href');
    console.log('open this link', href);
    if (href) {
       evt.preventDefault();
       this.iab.create(href, '_system');
    }
  }

  sanitizerUrl(url) {
    return this.sanitizer.bypassSecurityTrustHtml(this.convertLink(url));
  }

  convertLink(text?) {
    var urlRegex = /(\b(https?|http):\/\/[-A-Z0-9+&@#\/%?=_|!:,.;]*[-A-Z0-9+&@#\/%=_|])/gi;
    return text.replace(urlRegex, (url) => {
      return `<a style="color:blue !important" href="${url}"> ${url} </a>`;
    });
  }

}
