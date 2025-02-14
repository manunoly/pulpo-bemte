import { async } from '@angular/core/testing';
import { UploadFileImageService } from './../service/upload-file-image.service';
import { UploadService } from './../servicios/upload.service';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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
  fichero = [];
  rangosHorarios = [
    { hora_inicio: '6:00', hora_fin: '9:00' },
    { hora_inicio: '9:00', hora_fin: '12:00' },
    { hora_inicio: '12:00', hora_fin: '15:00' },
    { hora_inicio: '15:00', hora_fin: '18:00' },
    { hora_inicio: '18:00', hora_fin: '21:00' },
    { hora_inicio: '21:00', hora_fin: '00:00' },
    { hora_inicio: '00:00', hora_fin: '06:00' },
  ];
  img;
  fechaMaxima;
  fechaMinima;
  hoy;
  customActionSheetOptions: any = { cssClass: 'fondoVerde alertDefault' };

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService, public upload: UploadService,
    private uploadFile: UploadFileImageService) {
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
      this.materias = await this.db.get('lista-materias');
    } else {
      this.router.navigateByUrl('inicio');
    }

    setTimeout(() => {
      this.util.dismissLoading();
    }, 1000);
  }

  setMateria(materia) {
    this.tareaForm.controls["materia"].setValue(materia);
  }

  async confirmarTarea() {
    try {
      const hora = this.tareaForm.value.hora_rango;

      let dataPost = JSON.stringify(this.tareaForm.value);
      dataPost = JSON.parse(dataPost);

      dataPost['hora_inicio'] = hora.hora_inicio;
      dataPost['hora_fin'] = hora.hora_fin;
      dataPost['fecha_entrega'] = this.tareaForm.value.fecha_entrega.slice(0, 10);
      dataPost['materia'] = this.tareaForm.value.materia.nombre;

      this.util.showLoading();
      const resp = await this.db.post('solicitar-tarea', dataPost);
      if (resp && resp.success) {

        if (this.fichero && this.fichero.length > 0) {
          this.fichero.forEach(formData => {
            this.uploadFile.uploadImageData(formData);
          });

          this.fichero.forEach(async (formData) => {
            await this.db.post('subir-ejercicio', {
              user_id: this.tareaForm.value.user_id,
              tarea_id: resp.tarea.id,
              clase_id: 0,
              archivo: formData.get('filename'),
              drive: 0
            });
          });

        }

        this.util.dismissLoading();
        this.util.showMessage(resp.success);
        this.buildForm();
        this.router.navigateByUrl('tarea-detalles/' + resp.tarea.id);
      }
      else {
        this.util.dismissLoading();
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

  async seleccionarImagen() {
    try {
      this.upload.imagesSubject.subscribe(img => this.img = img);
      await this.upload.selectImage();
    } catch (error) {
    }
  }

  async seleccionarArchivo() {
    const file = await this.uploadFile.selectFile();
    if (file && file.get('filename')) {
      this.fichero.push(file);
    }
    console.log('seleccionarArchivo', this.fichero);

  }


  async selectImage() {
    this.uploadFile.selectImage();
    let obj = this.uploadFile.imagesSubject$.subscribe(async (img) => {
      if (img) {
        this.fichero.push(await this.uploadFile.getFormDataToUpload(img));
        setTimeout(() => {
          obj.unsubscribe();
          this.uploadFile.imagesSubject$.next('');
        }, 1000);
      }
      console.log('fichero de la accion selectImage', img, this.fichero);

    })
  }

  eliminar(key) {
    this.fichero = this.fichero.filter(f => f && f.get('filename') != key);
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
      this.util.showMessage("La tarea debe ser solicitada con 1 hora de antelación");

      // FIXME:arreglar la validacion para la fecha del mismo dia
      // console.log("la fecha es hoy");
      // this.tareaForm.controls["hora_rango"].setValue("");
    }
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }

  showMessage() {
    this.util.presentAlert('“Recuerda que tu deber será realizado de acuerdo a tus indicaciones, escribe de forma clara y completa lo que necesitas. Si tu formato de entrega es otros, escribe en qué formato deseas la entrega.', 'Información importante', ['Aceptar'], '', 'fondoVerde alertDefault');
  }
}
