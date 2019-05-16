import { Location } from '@angular/common';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.page.html',
  styleUrls: ['./clases.page.scss'],
})
export class ClasesPage implements OnInit {
  claseForm: FormGroup;
  materias;
  user;
  sedes;

  constructor(private navigation: Location, public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService) {
    this.buildForm();
  }

  async ionViewWillEnter() {
    if (this.user) {
      const clase = await this.db.get('clase-activa?user_id=' + this.user.user_id);
      if (clase != null && clase.hasOwnProperty('id')) {
        this.router.navigateByUrl('clase-estado');
      }
    }
  }

  async ngOnInit() {
    this.auth.currentUser.subscribe(async (user) => {
      if (user) {
        this.user = user;
        // const clase = await this.db.get('clase-activa?user_id=' + user.user_id);
        // if (clase != null && clase.hasOwnProperty('id')) {
        //   this.util.showMessage('Tiene una clase en proceso');
        //   this.router.navigateByUrl('clase-estado');
        //   return;
        // }
        this.materias = this.db.get('lista-materias');
        this.sedes = this.db.get('lista-sedes');
        this.claseForm.controls['user_id'].setValue(user.user_id);
      }
    });
  }

  buildForm() {
    this.claseForm = this.fb.group({
      'user_id': ['', Validators.required],
      'materia': ['', Validators.required],
      'tema': ['', Validators.required],
      'alumnos': ['', Validators.required],
      'ejercicios': [''],
      'fecha': ['', Validators.required],
      'hora1': [''],
      'hora2': [''],
      'ubicacion': ['', Validators.required]
    });
  }

  subir() {
    this.util.showMessage('en construcción');
  }

  async confirmarClase() {
    try {
      this.claseForm.controls['fecha'].setValue(this.claseForm.value.fecha.slice(0, 10));

      this.util.showLoading();
      const resp = await this.db.post('solicitar-clase', this.claseForm.value);
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('clase-estado');
      }
    } catch (error) {
      this.util.dismissLoading();
      console.log('error', error);
    }
  }

  atras() {
    this.navigation.back();
  }

}
