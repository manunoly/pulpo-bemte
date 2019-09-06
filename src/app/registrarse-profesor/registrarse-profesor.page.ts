import { FcmService } from './../servicios/fcm.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Location } from "@angular/common";
import { UtilService } from "./../servicios/util.service";
import { DbService } from "./../servicios/db.service";
import { AuthService } from "./../servicios/auth.service";
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

  constructor(
    private modalController: ModalController,
    private navigation: Location,
    public auth: AuthService,
    private db: DbService,
    private router: Router,
    private fb: FormBuilder,
    private fcm: FcmService,
    public util: UtilService
  ) { this.buildForm(); }

  async ngOnInit() {
    this.paisNumber = this.db.get('lista-paises');
    this.materias = this.db.get("lista-materias");

    if (this.util.isMobile()) {
      const token = await this.fcm.getToken();
      if (token) this.registroForm.controls["token"].setValue(token);
      this.registroForm.controls["sistema"].setValue(this.util.getSo());
    }
  }

  buildForm() {
    this.registroForm = new FormGroup({
      materia1: new FormControl("", Validators.required),
      materia2: new FormControl(""),
      materia3: new FormControl(""),
      materia4: new FormControl(""),
      materia5: new FormControl(""),
      nombre: new FormControl("", Validators.required),
      apellido: new FormControl("", Validators.required),

      fechaNacimiento: new FormControl("", Validators.required),
      genero: new FormControl("", Validators.required),


      apodo: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      passwordC: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      ubicacion: new FormControl("", Validators.required),
      pais: new FormControl("", Validators.required),
      ciudad: new FormControl("", Validators.required),
      tipo: new FormControl("Profesor", Validators.required),
      celular: new FormControl("", [Validators.required, Validators.minLength(9)]),
      clases: new FormControl(""),
      tareas: new FormControl(""),
      hojaVida: new FormControl(""),
      titulo: new FormControl(""),
      token: new FormControl(""),
      sistema: new FormControl("")
    });
  }
  confirmarCuenta() {
    console.log(this.registroForm.value);
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

  info() {
    alert('info');
  }

  cargarCiudades(pais) {
    this.ciudades = this.db.get('lista-ciudad-pais?pais=' + pais);
  }
}
