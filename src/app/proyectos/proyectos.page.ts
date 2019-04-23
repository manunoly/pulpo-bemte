import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss'],
})
export class ProyectosPage implements OnInit {
  proyectoForm: FormGroup;
  materias;

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService) {
    this.proyectoForm = this.fb.group({
      'materia': ['', Validators.required],
      'tema': ['', Validators.required],
      'fecha_entrega': ['', Validators.required],
      'hora_entrega': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'formato': ['Alumno', Validators.required]
    });
  }

  async ngOnInit() {
    this.materias = this.db.get('lista-materias');
  }

  confirmarProyecto() {
    this.util.showMessage('Si vamos a guardar la tarea');
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }
}
