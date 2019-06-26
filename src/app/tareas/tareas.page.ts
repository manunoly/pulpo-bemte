import { UploadService } from './../servicios/upload.service';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage {
  // export class TareasPage implements OnInit {
  tareaForm: FormGroup;
  materias;
  user;
  rangosHorarios = [{ hora_inicio: '12:00', hora_fin: '13:00' }, { hora_inicio: '14:00', hora_fin: '16:00' }];
  img;

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService, public upload: UploadService) {
    this.buildForm();
  }

  // async ionViewWillEnter() {
  //   if (this.user) {
  //     const tarea = await this.db.get('tarea-activa?user_id=' + this.user.user_id);
  //     if (tarea != null && tarea.hasOwnProperty('id')) {
  //       this.router.navigateByUrl('tarea-estado');
  //     }
  //   }
  // }

  async ionViewWillEnter() {
    this.util.showLoading();
    this.auth.currentUser.pipe(switchMap(user => {
      if (user) {
        this.user = user;
        return this.db.get('tarea-activa?user_id=' + user.user_id);
      }
      return of(null);
    }), first()).subscribe(tarea => {
      if (tarea != null && tarea.hasOwnProperty('id')) {
        this.util.dismissLoading();
        this.router.navigateByUrl('tarea-estado');
      } else {
        if (this.user) {
          this.tareaForm.controls['user_id'].setValue(this.user.user_id);
          this.materias = this.db.get('lista-materias');
        } else 
          this.router.navigateByUrl('inicio');
      }
      setTimeout(() => {
        this.util.dismissLoading();
      }, 1000);
    })

    // this.auth.currentUser.subscribe(async (user) => {
    //   if (user) {
    //     this.user = user;
    //     const tarea = await this.db.get('tarea-activa?user_id=' + user.user_id);
    //     if (tarea != null && tarea.hasOwnProperty('id')) {
    //       this.util.showMessage('Tiene una tarea en proceso');
    //       this.router.navigateByUrl('tarea-estado');
    //       return;
    //     }
    //     this.materias = this.db.get('lista-materias');
    //     this.tareaForm.controls['user_id'].setValue(user.user_id);
    //   }
    // });
  }

  async confirmarTarea() {
    try {
      const hora = this.tareaForm.value.hora_rango;
      console.log(hora);
      if (this.img.length > 0) {
        this.tareaForm.controls['archivo'].setValue(this.img[0].name);
      }
      this.tareaForm.controls['hora_inicio'].setValue(hora.hora_inicio);
      this.tareaForm.controls['hora_fin'].setValue(hora.hora_fin);
      this.tareaForm.controls['fecha_entrega'].setValue(this.tareaForm.value.fecha_entrega.slice(0, 10));

      this.util.showLoading();
      const resp = await this.db.post('solicitar-tarea', this.tareaForm.value);
      this.util.dismissLoading();
      if (resp && resp.success) {
        await this.transferir();
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('tarea-estado');

      }
    } catch (error) {
      this.util.dismissLoading();
      console.log('error', error);
    }
  }

  buildForm() {
    this.tareaForm = this.fb.group({
      'user_id': ['', Validators.required],
      // 'materia': new FormControl({ value: !this.materias, disabled: true }, Validators.required),
      'materia': ['', Validators.required],
      'tema': ['', Validators.required],
      'fecha_entrega': ['', Validators.required],
      'hora_rango': ['', Validators.required],
      'hora_inicio': [''],
      'hora_fin': [''],
      'archivo': [''],
      'descripcion': ['', Validators.required],
      'formato_entrega': ['', Validators.required]
    });
  }

  async subir() {
    try {
      this.upload.imagesSubject.subscribe(img => this.img = img);
      await this.upload.selectImage();
    } catch (error) {
    }
  }

  async transferir() {
    try {
      return await this.upload.startUpload();
      // this.util.showMessage(JSON.stringify(resp));
    } catch (error) {
      // this.util.showMessage(JSON.stringify(error));
    }
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }
}
