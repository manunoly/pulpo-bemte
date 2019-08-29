import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UploadService } from 'src/app/servicios/upload.service';
import { UtilService } from 'src/app/servicios/util.service';

@Component({
  selector: 'app-subir-transferencia',
  templateUrl: './subir-transferencia.component.html',
  styleUrls: ['./subir-transferencia.component.scss'],
})
export class SubirTransferenciaComponent implements OnInit {

  img;
  @Input() clase_id = 0;
  @Input() tarea_id = 0
  @Input() combo = 0
  @Output('accion')
  change: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public upload: UploadService, public util: UtilService, public auth: AuthService, public db: DbService) { }

  ngOnInit() { }
  ionViewWillEnter() {
    this.img = '';
  }

  async subir() {
    try {
      this.upload.imagesSubject.subscribe(img => this.img = img);
      await this.upload.selectImage();
    } catch (error) {
    }
  }

  async uploadData() {
    const user = await this.auth.getUserData();
    if (!user) {
      return this.util.showMessage('No hemos podido obtener los datos del usuario');
    }
    let data = {
      user_id: user.user_id,
      tarea_id: this.tarea_id,
      clase_id: this.clase_id,
      combo_id: '0'
    }
    if (this.tarea_id == 0 && this.clase_id == 0) {
      data['combo_id'] = 'COMBO';
      data['valor'] = this.combo['descuento'];
      data['horas'] = this.combo['hora'];;
    }

    try {
      if (this.img.length > 0) {
        data['archivo'] = this.img[0].name;
        await this.upload.startUpload();
      }

      else {
        this.util.showMessage('Por favor adjuntar imagen de pago');
        return;
      }

      const resp = await this.db.post('subir-transferencia', data);
      if (resp && resp.success) {
        setTimeout(() => {
          this.util.showMessage(resp.success);
          this.change.emit(true);
        }, 2000);
      } else {
        setTimeout(() => {
          this.change.emit(false);
        }, 3000);
      }

      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }
}
