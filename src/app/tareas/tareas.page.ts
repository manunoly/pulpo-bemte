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
// export class TareasPage {
export class TareasPage implements OnInit {
  tareaForm: FormGroup;
  materias;
  user;
  rangosHorarios = [{ hora_inicio: '12:00', hora_fin: '13:00' }, { hora_inicio: '14:00', hora_fin: '16:00' }];
  img;
  fechaMaxima;
  fechaMinima;
  hoy;

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService, public upload: UploadService) {
    let currentDate = new Date();
    this.hoy = currentDate;
    this.hoy.setHours(1);
    this.hoy = this.hoy.toISOString();
    currentDate.setDate(1);
    this.fechaMinima = currentDate.toISOString();
    currentDate.setMonth(currentDate.getMonth() + 1);
    this.fechaMaxima = currentDate.toISOString();

    this.buildForm();
  }
  
  async ngOnInit() {
    this.util.showLoading();
    this.user = await this.auth.getUserData();
    if (this.user) {
      this.tareaForm.controls['user_id'].setValue(this.user.user_id);
      this.materias = this.db.get('lista-materias');
    } else {
      this.router.navigateByUrl('inicio');
    }

    setTimeout(() => {
      this.util.dismissLoading();
    }, 1000);
  }

  async confirmarTarea() {
    try {
      const hora = this.tareaForm.value.hora_rango;
      if (this.img && this.img.length > 0) {
        this.tareaForm.controls['archivo'].setValue(this.img[0].name);
      }
      let dataPost = this.tareaForm.value;

      dataPost['hora_inicio'] = hora.hora_inicio;
      dataPost['hora_fin'] = hora.hora_fin;
      dataPost['fecha_entrega'] = this.tareaForm.value.fecha_entrega.slice(0, 10);

      this.util.showLoading();
      const resp = await this.db.post('solicitar-tarea', dataPost);
      this.util.dismissLoading();
      if (resp && resp.success) {
        await this.transferir();
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('tarea-detalles/' + resp.tarea.id);

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


  async validarHora(fechaD) {
    let fecha = new Date(fechaD);
    let hoy = new Date(this.hoy);


    let diff = fecha.getTime() - hoy.getTime();
    if (diff / (1000 * 60 * 60 * 24) > 30) {
      this.util.showMessage("Solicite su tarea con 30 días máximo de antelación");
      this.tareaForm.controls["hora_rango"].setValue("");
      this.tareaForm.controls["fecha_entrega"].setValue("");
      return;
    }

    if (hoy.getMonth() == fecha.getMonth() && hoy.getDate() > fecha.getDate()) {
      this.tareaForm.controls["fecha_entrega"].setValue("");
      this.tareaForm.controls["hora_rango"].setValue("");
      this.util.showMessage("Revise las fechas por favor");
      return;
    }
    if (
      hoy.getMonth() == fecha.getMonth() &&
      hoy.getDate() == fecha.getDate()
    ) {
      this.util.showMessage("La tarea debe ser solicitada con 3 horas de antelación");

      // FIXME:arreglar la validacion para la fecha del mismo dia
      // console.log("la fecha es hoy");
      // this.tareaForm.controls["hora_rango"].setValue("");
    }
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }
}
