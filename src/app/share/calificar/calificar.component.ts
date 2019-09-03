import { ModalController } from '@ionic/angular';
import { UtilService } from '../../servicios/util.service';
import { AuthService } from '../../servicios/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { DbService } from '../../servicios/db.service';

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

  constructor(private auth: AuthService, private db: DbService, public util: UtilService, public modalController: ModalController) { }

  ngOnInit() {
    console.log('esto recibo', this.calificarData);
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
    const user = await this.auth.getUserData();
    let data = {};
    if (user) {
      console.log(user);

      if (this.rating > 3 || this.opinion == undefined)
        data['comment'] = 'Sin Comentario';
      else {
        data['comment'] = this.opinion;
      }

      let url = 'calificar-profesor';

      if (user['tipo'] === 'Profesor') {
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
      data['user_id'] = user.user_id;
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
}
