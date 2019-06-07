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
  user;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private db: DbService,
    public auth: AuthService,
    public util: UtilService
  ) { }

  async ngOnInit() {

  }

  async editarPerfil() {
    try {
      this.util.showLoading();
      const resp = await this.db.post('actualizar-cuenta', this.registroForm.value);
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.editar = false;
      }
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async buildForm(user) {
    console.log(user);
    this.editar = true;
    this.registroForm = this.fb.group({
      'user_id': [''],
      'avatar': [user.avatar],
      'calificacion': [user.calificacion],
      'celular': [user.celular, Validators.required],
      'email': [user.correo, (Validators.required, Validators.email)],
      'hojaVida': [''],
      'titulo': [''],
      'nombre': [user.nombres, Validators.required],
      'apellido': [user.apellidos, Validators.required],
      'apodo': [user.apodo, Validators.required],
      'cedula': [user.cedula],
      'ciudad': [user.ciudad, Validators.required],
      'tipo': [user.tipo, Validators.required],
      'ubicacion': [user.ubicacion, Validators.required]
    });
    this.user = await this.auth.getUserData();
    if (this.user)
      this.registroForm.controls['user_id'].setValue(this.user.user_id);

  }
}
