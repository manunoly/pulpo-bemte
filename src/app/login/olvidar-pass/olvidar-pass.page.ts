import { AuthService } from './../../servicios/auth.service';
import { UtilService } from 'src/app/servicios/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-olvidar-pass',
  templateUrl: './olvidar-pass.page.html',
  styleUrls: ['./olvidar-pass.page.scss'],
})
export class OlvidarPassPage implements OnInit {

  constructor(public util: UtilService, private auth: AuthService) { }

  ngOnInit() {
  }


  async olvideContrasena(email) {
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (emailRegex.test(email)) {
      try {
        this.util.showLoading();
        const resp = await this.auth.olvidarContrasena(email);
        this.util.dismissLoading();
        if (resp && resp.success) {
          this.util.showMessage(resp.success);
          this.util.atras();
        }
      } catch (error) {
        this.util.dismissLoading();
      }
    } else
      this.util.showMessage('Por favor revise el email introducido!');
  }

}
