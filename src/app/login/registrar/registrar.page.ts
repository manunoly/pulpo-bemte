import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  registroForm: FormGroup;

  constructor(public alertController: AlertController, private router: Router,
    private fb: FormBuilder, private db: DbService, public util: UtilService
  ) {
    this.registroForm = this.fb.group({
      'celular': ['', Validators.required],
      'email': ['', (Validators.required, Validators.email)],
      'password': ['', (Validators.required, Validators.min(6))],
      'nombre': ['', Validators.required],
      'apellido': ['', Validators.required],
      'apodo': ['', Validators.required],
      'cedula': [''],
      'ciudad': ['Quito', Validators.required],
      'tipo': ['Alumno', Validators.required],
      'ubicacion': ['ubicacion', Validators.required]
    });
  }

  ngOnInit() {

  }
  paso = 1;


  siguiente(paso = 1) {
    this.paso = paso;
  }

  async confirmar() {
    const alert = await this.alertController.create({
      header: 'Terminos y condiciones!',
      message: 'Si continuas aceptas los terminos!',
      buttons: [
        {
          text: 'Leer',
          cssClass: 'secondary',
          handler: (blah) => {
            this.util.showMessage('Vamos a leer los terminos');
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            this.util.showLoading();
            try {
              const registrar = await this.db.post('registro', this.registroForm.value);
              console.log(registrar);
              this.util.dismissLoading();
              this.util.showMessage(registrar.success);
              this.router.navigateByUrl('login');
            } catch (error) {
              console.log(error);
              this.util.dismissLoading();
            }

          }
        }
      ]
    });

    await alert.present();
  }
}
