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
  ranking;
  eye = 'password';
  claseTareaSelect = [{ id: 1, value: 'Clases' }, { id: 2, value: 'Tareas' }, { id: 3, value: 'Clases y tareas' },]
  materias;
  materia1;
  materia2;
  materia3;
  materia4;
  materia5;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private db: DbService,
    public auth: AuthService,
    public util: UtilService,
    public upload: UploadService
  ) {
    this.db.get('lista-paises').then(paises => this.paisNumber = paises).catch(_ => { });

    this.auth.getUserData().then(user => {
      this.user = user;
      
      if (user && user.pais)
      this.db.get('lista-ciudad-pais?pais=' + user.pais).then(ciudades => this.ciudades = ciudades).catch(_ => { });

      console.log('usuario a editar', this.user);
      this.buildForm(this.user);
      if (this.util.esProfesor)
        this.db.get('profesor?user_id=' + user.user_id).then(resp => {
          this.ranking = resp;
        }).catch()
      else
        this.db.get('alumno?user_id=' + user.user_id).then(resp => {
          this.ranking = resp;
        }).catch()

    }).catch(error => {
      this.util.showMessage('Error cargando datos del usuario');
      console.log(error);
      this.util.atras();
    });
  }

  async ngOnInit() {

  }

  async validarUsuario() {
    const resp = await this.db.get('apodo-disponible?apodo=' + this.registroForm.value.apodo + '&user_id=' + this.user.user_id);
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
      if (this.user.tipo == 'Profesor')
        return this.util.showMessage('Contacte al administrador para actualizar su foto de perfil');

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

      if (this.user.tipo == 'Profesor') {
        if (this.materia1)
          this.registroForm.controls['materia1'].setValue(this.materia1.nombre);
        else {
          this.util.showMessage('Complete la primera materia');
          return this.registroForm.controls['materia1'].setValue('');
        }

        if (this.materia2) {
          this.registroForm.controls['materia2'].setValue(this.materia2.nombre);
        }
        else {
          this.registroForm.controls['materia2'].setValue('');
        }
        if (this.materia3) {
          this.registroForm.controls['materia3'].setValue(this.materia3.nombre);
        }
        else {
          this.registroForm.controls['materia3'].setValue('');
          }
        if (this.materia4) {
          this.registroForm.controls['materia4'].setValue(this.materia4.nombre);
        }
        else {
          this.registroForm.controls['materia4'].setValue('');
          }
        if (this.materia5) {
          this.registroForm.controls['materia5'].setValue(this.materia5.nombre);
        }
        else {
          this.registroForm.controls['materia5'].setValue('');
      } }

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
        }
      }
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async buildForm(user) {
    this.registroForm = this.fb.group({
      'user_id': [''],
      'avatar': [user.avatar],
      'paisCelular': [user.codigo, Validators.required],
      'celular': [user.celular, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
      'email': [user.correo, [Validators.required, Validators.email]],
      'oldPassword': ['', Validators.minLength(8)],
      'newPassword': ['', Validators.minLength(8)],
      'newPasswordConfirm': ['', Validators.minLength(8)],
      'nombre': [user.nombres, [Validators.required, Validators.minLength(3)]],
      'apellido': [user.apellidos, [Validators.required, Validators.minLength(3)]],
      'apodo': [user.apodo, [Validators.required, Validators.minLength(8)]],
      // 'pais': [user.pais, user.calificacion],
      'pais': [user.pais, user.required],
      'ciudad': [user.ciudad, Validators.required],
      'tipo': [user.tipo, Validators.required],
      'ubicacion': [user.ubicacion ? user.ubicacion : ' ', Validators.required],
      'descripcion': [user.descripcion ? user.descripcion : ' '],
      'clases': [user.clases ? user.clases : ' '],
      'tareas': [user.tareas ? user.tareas : ' '],
      'claseTarea': [],
      'materia1': [user.materia1 ? user.materia1 : ''],
      'materia2': [user.materia2 ? user.materia2 : ''],
      'materia3': [user.materia3 ? user.materia3 : ''],
      'materia4': [user.materia4 ? user.materia4 : ''],
      'materia5': [user.materia5 ? user.materia5 : ''],
    });

    if (this.user) {
      this.registroForm.controls['user_id'].setValue(this.user.user_id);
      if (this.user.tipo == 'Profesor') {
        if (this.user.clases && this.user.tareas) {
          this.registroForm.controls['claseTarea'].setValue(3);
        } else if (this.user.tareas) {
          this.registroForm.controls['claseTarea'].setValue(2);
        } else if (this.user.clases)
          this.registroForm.controls['claseTarea'].setValue(1);

        this.materias = await this.db.get("lista-materias");

        if (this.user.materia1)
          this.materia1 = this.materias.filter(x => x.nombre == this.user.materia1)[0];

        if (this.user.materia2)
          this.materia2 = this.materias.filter(x => x.nombre == this.user.materia2)[0];

        if (this.user.materia3)
          this.materia3 = this.materias.filter(x => x.nombre == this.user.materia3)[0];

        if (this.user.materia4)
          this.materia4 = this.materias.filter(x => x.nombre == this.user.materia4)[0];

        if (this.user.materia5)
          this.materia5 = this.materias.filter(x => x.nombre == this.user.materia5)[0];
      }
    }

  }

  async cargarCiudades(pais?) {
    if (!pais)
      pais = this.registroForm.value.pais;
    this.ciudades = await this.db.get('lista-ciudad-pais?pais=' + pais);
  }

  setClasesTareas(status) {
    if (status == 3) {
      this.registroForm.controls['clases'].setValue(1);
      this.registroForm.controls['tareas'].setValue(1);
    } else
      if (status == 2) {
        this.registroForm.controls['clases'].setValue(0);
        this.registroForm.controls['tareas'].setValue(1);
      } else
        if (status == 1) {
          this.registroForm.controls['clases'].setValue(1);
          this.registroForm.controls['tareas'].setValue(0);
        }
  }


  async verificarMateria(materia, no) {
    if (materia === this.materia1 && no != 1) {
      return this.resetMateria(no);
    }

    if (materia === this.materia2 && no != 2) {
      return this.resetMateria(no);
    }

    if (materia === this.materia3 && no != 3) {
      return this.resetMateria(no);
    }

    if (materia === this.materia4 && no != 4) {
      return this.resetMateria(no);
    }

    if (materia === this.materia5 && no != 5) {
      return this.resetMateria(no);
    }
  }

  async resetMateria(no) {
    setTimeout(() => {
      switch (no) {
        case 1: {
          this.materia1 = undefined;
          break;
        }

        case 2: {
          this.materia2 = undefined;
          break;
        }

        case 3: {
          this.materia3 = undefined;
          break;
        }

        case 4: {
          this.materia4 = undefined;
          break;
        }

        case 5: {
          this.materia5 = undefined;
          break;
        }
      }
      this.util.showMessage('Por favor revise las materias seleccionadas');
    }, 100);
  }
}
