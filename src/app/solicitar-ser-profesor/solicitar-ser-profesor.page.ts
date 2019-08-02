import { Component, OnInit } from '@angular/core';
import { UploadService } from './../servicios/upload.service';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-solicitar-ser-profesor',
  templateUrl: './solicitar-ser-profesor.page.html',
  styleUrls: ['./solicitar-ser-profesor.page.scss'],
})
export class SolicitarSerProfesorPage implements OnInit {
  profesorForm: FormGroup;

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService, public upload: UploadService) { this.buildForm() }

  ngOnInit() {
  }

  goto(){
    window.location.assign('https://play.google.com/store/apps');
  }

  buildForm() {
    this.profesorForm = this.fb.group({
      'user_id': [''],
      'cedula': ['1234567890', [Validators.minLength(10), Validators.maxLength(10), Validators.required]],
      'clases': ['false'],
      'tareas': ['false'],
      'hojaVida': [''],
      'titulo': ['']
    });
  }

  async subir() {
    try {
      await this.upload.selectImage();
      // this.img = await this.upload.loadStoredImages();
    } catch (error) {
    }
  }

  async transferir() {
    try {
      const resp = await this.upload.startUpload();
      this.util.showMessage(JSON.stringify(resp));
    } catch (error) {
      this.util.showMessage(JSON.stringify(error));
    }
  }

  async solitar() {
    const user = await this.auth.getUserData();
    if (user) {
      this.profesorForm.controls['user_id'].setValue(user.user_id);
      const resp = await this.db.post('aplicar-profesor', this.profesorForm.value);
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        setTimeout(() => {
          this.router.navigateByUrl('inicio');
        }, 2000);
      }
    } else
      this.util.showMessage('No hemos podido resolver los datos del usuario');
    // 
  }
}
