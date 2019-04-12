import { UtilService } from './../servicios/util.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private util: UtilService,
    private router: Router

  ) {
    this.authForm = this.fb.group({
      'email': ['', (Validators.required, Validators.email)],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  async  login() {
    try {
      await this.util.presentLoading();
      const resp = await this.auth.login(this.authForm.value);
      await this.util.dismissLoading();
      if (resp) {
        this.router.navigateByUrl('home');
      }
    } catch (error) {
      await this.util.dismissLoading();
      this.util.showMessage(error);
    }
  }
  async registrar() {
    this.router.navigateByUrl('registrar');

  }
}
