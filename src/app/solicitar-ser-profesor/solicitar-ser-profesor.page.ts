import { Component, OnInit } from '@angular/core';
import { UploadService } from './../servicios/upload.service';
import { UtilService } from './../servicios/util.service';
import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, shareReplay, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-solicitar-ser-profesor',
  templateUrl: './solicitar-ser-profesor.page.html',
  styleUrls: ['./solicitar-ser-profesor.page.scss'],
})
export class SolicitarSerProfesorPage implements OnInit {
  tareaForm: FormGroup;

  constructor(public auth: AuthService, private db: DbService, private router: Router,
    private fb: FormBuilder, public util: UtilService, public upload: UploadService) { this.buildForm() }

  ngOnInit() {
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

  async solitar(){
    // 'aplicar-profesor'
  }
}
