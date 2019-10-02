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
      // 'email': ['manunoly@gmail.com', [Validators.required, Validators.email]],
      // 'password': ['12345678', Validators.required]
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
    this.router.navigateByUrl('olvidar-pass');
  }
}
