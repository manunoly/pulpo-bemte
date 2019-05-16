import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage implements OnInit {
  tareaForm: FormGroup;
  materias;
  user;
  rangosHorarios = [{ hora_inicio: '12:00', hora_fin: '13:00' }, { hora_inicio: '14:00', hora_fin: '16:00' }];

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService) {
    this.buildForm();
  }

  async ionViewWillEnter() {
    if (this.user) {
      const tarea = await this.db.get('tarea-activa?user_id=' + this.user.user_id);
      if (tarea != null && tarea.hasOwnProperty('id')) {
        this.router.navigateByUrl('tarea-estado');
      }
    }
  }

  async ngOnInit() {
    this.auth.currentUser.subscribe(async (user) => {
      if (user) {
        this.user = user;
        const tarea = await this.db.get('tarea-activa?user_id=' + user.user_id);
        if (tarea != null && tarea.hasOwnProperty('id')) {
          this.util.showMessage('Tiene una tarea en proceso');
          this.router.navigateByUrl('tarea-estado');
          return;
        }
        this.materias = this.db.get('lista-materias');
        this.tareaForm.controls['user_id'].setValue(user.user_id);
      }
    });
  }

  async confirmarTarea() {
    try {
      const hora = this.tareaForm.value.hora_rango;
      console.log(hora);
      this.tareaForm.controls['hora_inicio'].setValue(hora.hora_inicio);
      this.tareaForm.controls['hora_fin'].setValue(hora.hora_fin);
      this.tareaForm.controls['fecha_entrega'].setValue(this.tareaForm.value.fecha_entrega.slice(0, 10));

      this.util.showLoading();
      const resp = await this.db.post('solicitar-tarea', this.tareaForm.value);
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.router.navigateByUrl('tarea-estado');

      }
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
      console.log('error', error);
    }
  }

  buildForm() {
    this.tareaForm = this.fb.group({
      'user_id': ['', Validators.required],
      'materia': ['', Validators.required],
      'tema': ['', Validators.required],
      'fecha_entrega': ['', Validators.required],
      'hora_rango': ['', Validators.required],
      'hora_inicio': [''],
      'hora_fin': [''],
      'descripcion': ['', Validators.required],
      'formato_entrega': ['', Validators.required]
    });
  }

  subir(){
    
    this.util.showMessage('en construcción');
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }
}
