import { TerminosPage } from './../terminos/terminos.page';
import { RegistrarseConfirmPage } from './../registrarse-confirm/registrarse-confirm.page';
import { FcmService } from '../../servicios/fcm.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { UtilService } from "../../servicios/util.service";
import { DbService } from "../../servicios/db.service";
import { AuthService } from "../../servicios/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-registrarse-profesor',
  templateUrl: './registrarse-profesor.page.html',
  styleUrls: ['./registrarse-profesor.page.scss'],
})
export class RegistrarseProfesorPage implements OnInit {
  registroForm: FormGroup;
  paisNumber;
  paso = 1;
  paises;
  ciudades;
  materias;
  eye = 'password';

  constructor(
    private modalController: ModalController,
    public auth: AuthService,
    private db: DbService,
    private router: Router,
    private fb: FormBuilder,
    private fcm: FcmService,
    public util: UtilService
  ) { this.buildForm(); }

  async ngOnInit() {
    this.paisNumber = this.db.get('lista-paises');
    this.materias = await this.db.get("lista-materias");

    if (this.util.isMobile()) {
      const token = await this.fcm.getToken();
      if (token) this.registroForm.controls["token"].setValue(token);
      this.registroForm.controls["sistema"].setValue(this.util.getSo());
    }
  }

  async verificarMateria(materia, posicion?) {
    console.log('la materia', materia);
    let i;
    [1, 2, 3, 4, 5].forEach(element => {
      if (element != posicion) {
        i = 'materia' + element;
        if (this.registroForm.value[i] != undefined && materia['nombre'] == this.registroForm.value[i]['nombre']) {
          console.log('la posicion', i, this.registroForm.value[i]);
          this.util.showMessage('No debe repetir la materia');
          this.registroForm.value['materia' + posicion] = '';
          this.registroForm.controls['materia' + posicion].setValue('')
        }
      }
    });
  }

  buildForm() {
    this.registroForm = new FormGroup({
      nombre: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(110)]),
      apellido: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(110)]),
      fecha_nacimiento: new FormControl("", Validators.required),
      pais: new FormControl("", Validators.required),
      ciudad: new FormControl("", Validators.required),
      genero: new FormControl("", Validators.required),
      ubicacion: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(110)]),

      apodo: new FormControl("", [Validators.required, Validators.min(8)]),
      email: new FormControl("", [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(110)]),
      paisNumero: new FormControl("", Validators.required),
      celular: new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(10)]),
      password: new FormControl("", [Validators.required, Validators.min(8)]),
      passwordC: new FormControl("", [Validators.required, Validators.min(8)]),

      materia1: new FormControl("", Validators.required),
      materia2: new FormControl(""),
      materia3: new FormControl(""),
      materia4: new FormControl(""),
      materia5: new FormControl(""),

      tipo: new FormControl("Profesor", Validators.required),
      descripcion: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(110)]),
      clases: new FormControl(""),
      tareas: new FormControl(""),
      hojaVida: new FormControl(""),
      titulo: new FormControl(""),
      token: new FormControl(""),
      sistema: new FormControl("")
    });
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

  async confirmarRegistro() {
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

  async registrarCuenta() {
    /**TODO: las materias, el telefono */
    let postData = this.registroForm.value;
    console.log(this.registroForm.value);

    postData['celular'] = '' + postData['paisNumero'] + postData['celular'];
    postData['fecha_nacimiento'] = '' + postData['fecha_nacimiento'].slice(0, 10);

    [1, 2, 3, 4, 5].forEach(element => {
      if (this.registroForm.value['materia' + element] != undefined) {
        postData['materia' + element] = this.registroForm.value['materia' + element]['nombre'];
      }
    });

    try {
      this.util.showLoading();
      const resp = await this.db.post('registro', postData);
      this.util.dismissLoading();

      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.buildForm();
        this.router.navigateByUrl('login');
      }
    } catch (error) {
      console.log(error);
      this.util.dismissLoading();
    }

  }

  setClasesTareas(tarea, clase) {
    if (tarea && clase) {
      this.registroForm.controls['clases'].setValue(1);
      this.registroForm.controls['tareas'].setValue(1);
    } else
      if (tarea) {
        this.registroForm.controls['clases'].setValue(0);
        this.registroForm.controls['tareas'].setValue(1);
      } else
        if (clase) {
          this.registroForm.controls['clases'].setValue(1);
          this.registroForm.controls['tareas'].setValue(0);
        }
  }

  info(){

  }

  cargarCiudades(pais) {
    this.util.showLoading();
    this.ciudades = this.db.get('lista-ciudad-pais?pais=' + pais);
    setTimeout(() => {
      this.util.dismissLoading();
    }, 1000);
  }
}
