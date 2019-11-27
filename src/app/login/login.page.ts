import { ProfeEstadoCuentaPage } from './../profe-estado-cuenta/profe-estado-cuenta.page';
import { AlertController } from '@ionic/angular';
import { UtilService } from './../servicios/util.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from "@ionic/angular";

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
    private modalController: ModalController

  ) {
    this.authForm = this.fb.group({
      // 'email': ['', [Validators.required, Validators.email]],
      // 'password': ['', [Validators.required, Validators.minLength(6)]]
      'email': ['manunoly@gmail.com', [Validators.required, Validators.email]],
      'password': ['12345678', Validators.required]
    });
  }

  ngOnInit() {
  }

  async  login() {
    if (!this.authForm.value.password || !this.authForm.value.email) {
      this.util.showMessage('Favor verifique los datos');
      return;
    }

    try {
      await this.util.showLoading();
      const resp = await this.auth.login(this.authForm.value);
      console.log('login auth resp',resp)
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
}
