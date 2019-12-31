import { ProfeEstadoCuentaPage } from './../profe-estado-cuenta/profe-estado-cuenta.page';
import { AlertController } from '@ionic/angular';
import { UtilService } from './../servicios/util.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from "@ionic/angular";

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authForm: FormGroup;
  backdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private util: UtilService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private face: Facebook,
    private googlePlus: GooglePlus
  ) {
    this.authForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      // 'email': ['manunoly@gmail.com', [Validators.required, Validators.email]],
      // 'password': ['12345678', Validators.required,],
      'social': ['']
    });
  }

  ngOnInit() {
  }

  async login() {
    if (!this.authForm.value.password || !this.authForm.value.email) {
      this.util.showMessage('Favor verifique los datos');
      return;
    }

    try {
      await this.util.showLoading();
      const resp = await this.auth.login(this.authForm.value);
      console.log('login auth resp', resp)
      this.util.dismissLoading();
      if (resp != undefined && resp && resp.tipo != undefined) {
        if (resp.tipo == 'Profesor')
          this.router.navigateByUrl('inicio-profesor');
        else
          this.router.navigateByUrl('inicio');
      } else if (resp == 'rechazado') {
        this.estadoCuentaModal('modalRojo my-custom-modal-css', { estado: 'rechazado' })
      } else if (resp == 'profeVerificando') {
        this.estadoCuentaModal('modalAzul my-custom-modal-css', { estado: '' })
      }

    } catch (error) {
      await this.util.dismissLoading();
    }
  }

  async estadoCuentaModal(cssModal, parametros) {
    const myModal = await this.modalController.create({
      component: ProfeEstadoCuentaPage,
      cssClass: cssModal,
      componentProps: parametros
    });
    return await myModal.present();
  }

  async registrar() {
    this.router.navigateByUrl('registrarse');
  }

  async olvideContrasena() {
    this.router.navigateByUrl('olvidar-pass');
  }

  fbLogin() {
    this.face.login(['public_profile', 'email'])
      .then(res => {
        console.log('response face connect', res);
        if (res.status === 'connected') {
          this.getUserDetail(res.authResponse.userID);
        }
      })
      .catch(e => {
        this.util.showMessage('Error conectado con Facebook');
        console.log('Error logging into Facebook', e)
      });
  }

  getUserDetail(userid: any) {
    this.face.api('/' + userid + '/?fields=id,email,first_name,last_name', ['public_profile'])
      .then(res => {
        console.log('response face api user data', res);
        // id: "10218333794073857" email: "manunoly@gmail.com" id: "10218333794073857" first_name: "Manuel" last_name: "Almaguer Ochoa"

        if (res && res['email']) {
          this.authForm.controls["email"].setValue(res['email']);
          this.authForm.controls["password"].setValue(null);
          this.authForm.controls["social"].setValue(1);
          this.util.showLoading();
          this.auth.login(this.authForm.value).then(resp => {
            setTimeout(() => {
              this.util.dismissLoading();
            }, 500);
            if (resp != undefined && resp && resp.tipo != undefined)
              this.router.navigateByUrl('inicio');
            else {
              this.util.setTemporalData(res);
              this.router.navigateByUrl('registrarse');
            }
          }).catch(error => {
            setTimeout(() => {
              this.util.dismissLoading();
            }, 500);
            this.util.setTemporalData(res);
            this.router.navigateByUrl('registrarse');
          })

          this.util.dismissLoading();
        }

      })
      .catch(e => {
        this.util.showMessage('Error conectado con Facebook');
        console.log('face error api', e);
      });
  }

  googleLogin() {
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '936528253935-47kbp3l66okesaf7tbgst91imbeu38v1.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
      .then(res => {
        console.log('googlePlus login', res);

        if (res && res['email']) {
          this.authForm.controls["email"].setValue(res['email']);
          this.authForm.controls["password"].setValue(null);
          this.authForm.controls["social"].setValue(1);
          this.util.showLoading();
          this.auth.login(this.authForm.value).then(resp => {
            setTimeout(() => {
              this.util.dismissLoading();
            }, 500);
            if (resp != undefined && resp && resp.tipo != undefined)
              this.router.navigateByUrl('inicio');
            else {
              this.util.setTemporalData({ email: res['email'], 'first_name': res['displayName'] });
              this.router.navigateByUrl('registrarse');
            }
          }).catch(error => {
            setTimeout(() => {
              this.util.dismissLoading();
            }, 500);
            this.util.setTemporalData(res);
            this.router.navigateByUrl('registrarse');
          })
        }
      })
      .catch(err => {
        console.error('googlePlus error', err);
        this.util.showMessage('Error conectado con Google');

      });
  }


  async confirmaEnviarArchivo(res?) {
    {

      const alert = await this.alertController.create({
        header: 'Nuevo Usuario!',
        message: `Te gustaria Registrarte`,
        cssClass: 'fondoVerde alertDefault',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: (data) => {

            }
          }, {
            text: 'Enviar',
            handler: () => {
              this.util.setTemporalData(res);
              this.router.navigateByUrl('registrarse');
            }
          }
        ]
      });

      await alert.present();
    }
  }
}
