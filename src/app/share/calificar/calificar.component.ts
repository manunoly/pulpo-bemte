import { ModalController } from '@ionic/angular';
import { UtilService } from '../../servicios/util.service';
import { AuthService } from '../../servicios/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { DbService } from '../../servicios/db.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.component.html',
  styleUrls: ['./calificar.component.scss'],
})
export class CalificarComponent implements OnInit {
  msg;
  rating;
  opinion;
  @Input() calificarData?: any;
  @Input() tipo?: string;
  otroD;
  urlPhoto;
  user;

  constructor(public auth: AuthService, private db: DbService, public util: UtilService, public modalController: ModalController) { }

  async ngOnInit() {
    this.user = await this.auth.getUserData();

    this.urlPhoto = environment.photo_url;
    console.log('esto recibo', this.calificarData, 'tipo', this.tipo);
  }

  public rate(index: number) {
    this.rating = index;
  }

  isAboveRating(index: number): boolean {
    return index > this.rating;
  }

  getColor(index: number) {
    enum COLORS { GREY = "#E0E0E0", GREEN = "#76FF03", YELLOW = "#FFCA28", RED = "#DD2C00" };

    if (this.isAboveRating(index)) {
      return COLORS.GREY;
    }

    switch (this.rating) {
      case 1:
      case 2:
        return COLORS.RED;
      case 3:
        return COLORS.YELLOW;
      case 4:
      case 5:
        return COLORS.GREEN;
      default:
        return COLORS.GREY;
    }
  }

  async calificar() {
    let data = {};
    if (this.user) {

      if (this.rating > 3 || this.opinion == undefined)
        data['comment'] = 'Sin Comentario';
      else {
        if (this.opinion == 'Otros')
          data['comment'] = this.otroD;
        else
          data['comment'] = this.opinion;
      }

      let url = 'calificar-profesor';

      if (this.user['tipo'] === 'Profesor') {
        url = 'calificar-alumno';
        data['user_id_calif'] = this.calificarData.user_id;
      } else {
        data['user_id_calif'] = this.calificarData.user_id_pro;
      }

      if (this.tipo == 'clase') {
        data['clase_id'] = this.calificarData.id;
        data['tarea_id'] = null;

      } else if (this.tipo == 'tarea') {
        data['tarea_id'] = this.calificarData.id;
        data['clase_id'] = null;
      }

      /**FIXME: preguntar que es el user_id_calif vs user_id */
      data['user_id'] = this.user.user_id;
      data['calificacion'] = this.rating;

      try {
        this.util.showLoading();
        const resp = await this.db.post(url, data);
        this.util.dismissLoading();
        if (resp && resp.success) {
          this.util.showMessage(resp.success);
          this.close();
        }
      } catch (error) {
        this.util.dismissLoading();
      }
    } else {
      this.util.showMessage('No hemos podido identifcar al usuario');
      this.close();
    }
  }

  close() {
    this.modalController.dismiss();
  }

  async infoTareaNoEntregada() {
    let msg = `
    Si tu tarea no a fue entregada envia un reclamo al mail:
    informacion@bemte.ec 
    Con los siguientes datos:<br>
    -Nombres y Apellidos <br>
    -Usuario  <br>
    -Celular <br>
    -Fecha y hora de entrega <br>
    -Screenshot la Tarea`;

    this.util.presentAlert(msg, '', ['Aceptar'], '', 'fondoVerde alertDefault')
  }
}