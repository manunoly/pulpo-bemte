import { AuthService } from './../servicios/auth.service';
import { DbService } from './../servicios/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../servicios/util.service';

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
  ) {
    this.auth.getUserData().then(user => {
      this.user = user;
      this.buildForm(this.user);
    }).catch(error => {
      this.util.showMessage('Error cargando datos del usuario');
      console.log(error);
      this.router.navigateByUrl('inicio');
    });
  }

  async ngOnInit() {

  }

  async editarPerfil() {
    try {
      this.util.showLoading();
      const resp = await this.db.post('actualizar-cuenta', this.registroForm.value);
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.auth.setAuth(JSON.stringify(resp.profile));
        this.editar = false;
      }
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async buildForm(user) {
    this.editar = true;
    this.registroForm = this.fb.group({
      'user_id': [''],
      'avatar': [user.avatar],
      'calificacion': [user.calificacion],
      'celular': [user.celular,[Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      'email': [user.correo, [Validators.required, Validators.email]],
      'hojaVida': [''],
      'titulo': [''],
      'oldPassword': ['',Validators.minLength(6)],
      'newPassword': ['',Validators.minLength(8)],
      'newPasswordConfirm': ['',Validators.minLength(8)],
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
