import { AlertController } from '@ionic/angular';
import { UtilService } from './../servicios/util.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { async } from 'q';

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
    private alertController: AlertController

  ) {
    this.authForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      // 'password': ['', Validators.required]
      'password': ['', [Validators.required, Validators.minLength(6)]]
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
      this.util.dismissLoading();
      if (resp != undefined && resp && resp.tipo != undefined) {
        if (resp.tipo == 'Profesor')
          this.router.navigateByUrl('inicio-profesor');
        else
          this.router.navigateByUrl('inicio');
      }
    } catch (error) {
      await this.util.dismissLoading();
    }
  }

  async registrar() {
    this.router.navigateByUrl('registrarse');
  }

  async olvideContrasena() {
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    const alert = await this.alertController.create({
      header: 'Confirmar Correo!',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'correo electronico registrado'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar',
          handler: async (data) => {
            if (emailRegex.test(data.email)) {
              this.auth.olvidarContrasena(data.email);
            } else
              this.util.showMessage('Por favor revise el email introducido!');
            console.log(data);
          }
        }
      ]
    });

    await alert.present();
  }
}
