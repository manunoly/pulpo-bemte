import { Location } from '@angular/common';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.page.html',
  styleUrls: ['./clases.page.scss'],
})
export class ClasesPage {
  // export class ClasesPage implements OnInit {
  claseForm: FormGroup;
  materias;
  user;
  sedes;
  combos;
  horasCombo;
  comprar;
  comboToBuy;

  constructor(private navigation: Location, public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService) {
    this.buildForm();
  }

  async ionViewWillEnter() {
    this.util.showLoading();
    this.auth.currentUser.pipe(switchMap(user => {
      if (user) {
        this.user = user;
        return this.db.get('clase-activa?user_id=' + user.user_id);
      }
      return of(null);
    }), first()).subscribe(clase => {
      if (clase != null && clase.hasOwnProperty('id')) {
        this.util.dismissLoading();
        this.router.navigateByUrl('clase-estado');
      } else {

        this.comboToBuy = this.db.getComboToBuy();
        if (!this.comboToBuy) {
          this.util.dismissLoading();
          this.db.setComboToBuy({ type: 'clases' })
          this.router.navigateByUrl('combos');
          return;
        }
        console.log('este es el combo que voy a comprar ', this.comboToBuy);
        /**
         * TODO: buscar horas y combos disponibles
         */

        if (this.user) {
          this.materias = this.db.get('lista-materias');
          this.sedes = this.db.get('lista-sedes');
          this.combos = this.db.get('lista-combos');
          this.claseForm.controls['user_id'].setValue(this.user.user_id);
        } else
          this.router.navigateByUrl('inicio');
      }
      setTimeout(() => {
        this.util.dismissLoading();
      }, 1000);
    })
  }

  loadHoras(combo) {
    this.util.showLoading();
    this.horasCombo = this.db.get('combo-horas?combo=' + combo);
    setTimeout(() => {
      this.util.dismissLoading();
    }, 1000);
  }

  buildForm() {
    this.claseForm = this.fb.group({
      'user_id': ['', Validators.required],
      'materia': ['', Validators.required],
      'tema': ['', Validators.required],
      'personas': ['', Validators.required],
      'ejercicios': [''],
      'fecha': ['', Validators.required],
      'hora1': [''],
      'hora2': [''],
      'combo': [''],
      'horasCombo': [''],
      'precioCombo': [''],
      'duracion': [''],
      'hora': [''],
      'selProfesor': ['false'],
      'ubicacion': ['', Validators.required]
    });
  }

  subir() {
    this.util.showMessage('en construcción');
  }

  async confirmarClase() {
    // hora_fin: "13:00"hora1: "2019-06-07T11:10:08.543-05:00"
    // hora_inicio: "12:00"
    try {
      let horas;
      let precio;
      if (this.comboToBuy && this.comboToBuy.horas) {
        horas = this.comboToBuy.horas;
        precio = this.comboToBuy.precio;
      } else {
        let combo;
        if (this.comboToBuy && this.comboToBuy.combo) {
          combo = this.comboToBuy.combo;
        }
        else
          combo = this.claseForm.value.combo;
        if (!combo) {
          this.util.showMessage('No hemos podido determinar el combo');
          return;
        }
        // if (this.claseForm.value.horas)
        const user = await this.auth.getUserData();
        const resp = await this.db.get(`combo-alumno?combo=${combo}?user_id=${user.id}`);
        if (resp && resp['horas'])
          horas = resp['horas']
        else {
          this.util.showMessage('No hemos podido determinar las horas disponibles o solicitadas');
          return;
        }
      }
      /**
      TODO: aumentar horas solicitadas por la cantidad de alumnos.
      if(this.claseForm.value.alumnos > 1)
       */
      if (this.claseForm.value.duracion > horas) {
        this.util.showMessage('Las horas solicitadas para la clase es mayor a la cantidad disponible ');
        return;
      }

      this.claseForm.controls['combo'].setValue(this.comboToBuy.combo);
      this.claseForm.controls['horasCombo'].setValue(horas);
      this.claseForm.controls['precioCombo'].setValue(precio);
      this.claseForm.controls['fecha'].setValue(this.claseForm.value.fecha.slice(0, 10));
      this.claseForm.controls['hora1'].setValue(this.claseForm.value.hora1.slice(11, 16));
      this.claseForm.controls['hora2'].setValue(this.claseForm.value.hora2.slice(11, 16));

      this.util.showLoading();
      const resp = await this.db.post('solicitar-clase', this.claseForm.value);
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.db.setComboToBuy('');
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
