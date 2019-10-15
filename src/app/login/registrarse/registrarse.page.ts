import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FcmService } from "./../../servicios/fcm.service";
import { UtilService } from "./../../servicios/util.service";
import { DbService } from "./../../servicios/db.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { RegistrarseConfirmPage } from '../registrarse-confirm/registrarse-confirm.page';
import { ModalController } from "@ionic/angular";
import { TerminosPage } from '../terminos/terminos.page';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {
  registroForm: FormGroup;
  paisNumber;
  ciudades;
  eye = 'password';

  constructor(
    public alertController: AlertController,
    private router: Router,
    private fb: FormBuilder,
    private db: DbService,
    public util: UtilService,
    private fcm: FcmService,
    private modalController: ModalController,
    private auth: AuthService
  ) {
    this.registroForm = this.fb.group({
      celular: ["", [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      paisCelular: ["+593", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      password1: ["", [Validators.required, Validators.minLength(8)]],
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      apodo: ["", [Validators.required, Validators.minLength(8)]],
      cedula: [""],
      token: [""],
      sistema: [""],
      pais: ["", Validators.required],
      ciudad: ["Quito", Validators.required],
      tipo: ["Alumno", Validators.required],
      ubicacion: ["", Validators.required]
    });
  }

  async ngOnInit() {
    this.paisNumber = this.db.get('lista-paises');

    if (this.util.isMobile()) {
      const token = await this.fcm.getToken();
      if (token) this.registroForm.controls["token"].setValue(token);
      this.registroForm.controls["sistema"].setValue(this.util.getSo());
    }
  }


  async validarCorreo() {
    const resp = await this.db.get('correo-disponible?email=' + this.registroForm.value.email);
    if (!resp)
      this.util.showMessage('El correo ya se encuentra registrado');
  }

  async validarUsuario() {
    const resp = await this.db.get('apodo-disponible?apodo=' + this.registroForm.value.apodo);
    if (!resp)
      this.util.showMessage('El usuario ya se encuentra registrado');
  }

  async confirmarCuenta() {
    if (this.registroForm.value.password != this.registroForm.value.password1)
      return this.util.showMessage('Contraseñas iguales');
    const modal = await this.modalController.create({
      component: RegistrarseConfirmPage
    });

    modal.onDidDismiss().then(data => {
      if (data.data == 'terminos') {
        this.confirmarTerminos();
      } else if (data.data) {
        this.registrarCuenta();
      }
    });
    return await modal.present();
  }


  async confirmarTerminos() {

    const modal = await this.modalController.create({
      component: TerminosPage
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.registrarCuenta();
      }
    });
    return await modal.present();
  }

  async confirmar() {
    const alert = await this.alertController.create({
      header: `<h1> 'Terminos y condiciones!' </h1>`,
      message: "Si continuas aceptas los terminos!",
      buttons: [
        {
          text: "Leer",
          cssClass: "registrarse",
          handler: blah => {
            this.util.showMessage("Vamos a leer los terminos");
          }
        },
        {
          text: "Aceptar",
          handler: async () => {
            this.registrarCuenta();
          }
        }
      ]
    });

    await alert.present();
  }

  async registrarCuenta() {
    this.util.showLoading();
    try {
      const registrar = await this.db.post(
        "registro",
        this.registroForm.value
      );
      console.log(registrar);
      this.util.dismissLoading();
      if (registrar && registrar.success) {
        this.util.showMessage(registrar.success);
        if (registrar.profile != undefined) {
          this.auth.setAuth(registrar.profile);
          this.router.navigateByUrl('inicio');
        }
        else
          this.router.navigateByUrl("login");
      }
    } catch (error) {
      console.log(error);
      this.util.dismissLoading();
    }
  }

  back() {
    this.router.navigateByUrl('login');
  }


  cargarCiudades(pais) {
    this.util.showLoading();

    this.ciudades = this.db.get('lista-ciudad-pais?pais=' + pais);

    setTimeout(() => {
      this.util.dismissLoading();
    }, 1000);
  }

}
