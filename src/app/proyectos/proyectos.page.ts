import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss'],
})
export class ProyectosPage implements OnInit {
  proyectoForm: FormGroup;
  materias;
  user;
  rangosHorarios = [{hora_inicio:'12:00', hora_fin:'13:00'},{hora_inicio:'14:00', hora_fin:'16:00'}];

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService) {
    this.proyectoForm = this.fb.group({
      'user_id': ['', Validators.required],
      'materia': ['', Validators.required],
      'tema': ['', Validators.required],
      'fecha_entrega': ['', Validators.required],
      'hora_inicio': ['', Validators.required],
      'hora_fin': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'formato_entrega': ['Alumno', Validators.required]
    });
  }

  async ngOnInit() {
    this.materias = this.db.get('lista-materias');
    this.auth.currentUser.subscribe(user => {
      console.log(user);
      if (user)
        this.proyectoForm.controls['user_id'].setValue(user.user_id);
    });
  }

  async confirmarProyecto() {
    try {
      this.util.showLoading();
      const resp = await this.db.post(this.proyectoForm.value);
      if (resp) {
        this.util.showMessage(resp as any);
        this.util.setStorage('tarea',resp);
      }
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
      console.log('error', error);
    }
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }
}
