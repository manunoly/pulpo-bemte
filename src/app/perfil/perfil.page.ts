import { AuthService } from './../servicios/auth.service';
import { DbService } from './../servicios/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../servicios/util.service';
import { first, take } from 'rxjs/operators';
import { async } from 'q';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario = {
    foto: '/assets/img/logo.png',
    nombre: 'señor estimado',
    apodo: 'señor x',
    telefono: '98798798',
    email: 'email@pulpo.ec',
    direccion: 'pulpo.ec',
    universidad: 'Udla'
  }
  registroForm: FormGroup;
  editar;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private db: DbService,
    public auth: AuthService,
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  editarPerfil() {
    this.editar = false;
    this.util.showMessage('Vamos a guardar los datos')
    console.log(this.registroForm.value);
  }

  buildForm(user) {
    this.editar = true;
    this.registroForm = this.fb.group({
      'avatar': [user.avatar],
      'calificacion': [user.calificacion],
      'celular': [user.celular, Validators.required],
      'correo': [user.correo, (Validators.required, Validators.email)],
      'password': [''],
      'nombres': [user.nombres, Validators.required],
      'apellidos': [user.apellidos, Validators.required],
      'apodo': [user.apodo, Validators.required],
      'cedula': [user.cedula],
      'ciudad': [user.ciudad, Validators.required],
      'tipo': [user.tipo, Validators.required],
      'ubicacion': [user.ubicacion, Validators.required]
    });
  }
}
