import { AuthService } from './../servicios/auth.service';
import { DbService } from './../servicios/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../servicios/util.service';
import { UploadService } from '../servicios/upload.service';

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
  paisNumber;
  ciudades;
  img;
  imgPerfil;
  eye = 'password';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private db: DbService,
    public auth: AuthService,
    public util: UtilService,
    public upload: UploadService
  ) {
    this.paisNumber = this.db.get('lista-paises');
    this.auth.getUserData().then(user => {
      this.user = user;
      console.log('usuario a editar', this.user);
      this.buildForm(this.user);
    }).catch(error => {
      this.util.showMessage('Error cargando datos del usuario');
      console.log(error);
      this.router.navigateByUrl('inicio');
    });
  }

  async ngOnInit() {

  }

  async validarUsuario() {
    const resp = await this.db.get('apodo-disponible?apodo=' + this.registroForm.value.apodo);
    if (!resp) {
      this.util.showMessage('El usuario ya se encuentra registrado');
      return true;
    }
  }

  ionViewDidLeave() {
    if (this.imgPerfil) {
      this.img.unsubscribe();
      this.upload.deleteImage(this.imgPerfil);
      this.imgPerfil = '';
    }
  }

  async subirFotoPerfil() {
    try {
      this.upload.selectImage();
      this.img = this.upload.imagesSubject.subscribe(img => {
        console.log(img);
        if (img != undefined && img.length > 0) {
          this.imgPerfil = img[0];
          this.registroForm.controls['avatar'].setValue(img[0].name);
        }
      });
    } catch (error) {
    }
  }

  async editarPerfil() {
    try {
      this.util.showLoading();
      if (this.imgPerfil) {
        this.upload.startUpload(this.imgPerfil);
      }
      const resp = await this.db.post('actualizar-cuenta', this.registroForm.value);
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.auth.setAuth(resp.profile);
        if (this.imgPerfil) {
          this.img.unsubscribe();
          this.upload.deleteImage(this.imgPerfil);
          this.imgPerfil = '';
        }
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
      'paisCelular': [user.codigo, Validators.required],
      'celular': [user.celular, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      'email': [user.correo, [Validators.required, Validators.email]],
      'oldPassword': ['', Validators.minLength(8)],
      'newPassword': ['', Validators.minLength(8)],
      'newPasswordConfirm': ['', Validators.minLength(8)],
      'nombre': [user.nombres, Validators.required],
      'apellido': [user.apellidos, Validators.required],
      'apodo': [user.apodo, Validators.required],
      // 'pais': [user.pais, user.calificacion],
      'pais': ['Ecuador', user.calificacion],
      'ciudad': [user.ciudad, Validators.required],
      'tipo': [user.tipo, Validators.required],
      'ubicacion': [user.ubicacion ? user.ubicacion : ' ', Validators.required]
    });

    if (this.user)
      this.registroForm.controls['user_id'].setValue(this.user.user_id);
    this.cargarCiudades('Ecuador');

  }

  cargarCiudades(pais?) {
    if (!pais)
      pais = this.registroForm.value.pais;
    this.ciudades = this.db.get('lista-ciudad-pais?pais=' + pais);
  }

}
