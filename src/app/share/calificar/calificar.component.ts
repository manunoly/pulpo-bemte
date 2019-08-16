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
  @Input() tarea?: string;
  @Input() clase?: string;
  @Input() idEstudiante?: string;
  @Input() idProfesor?: string;

  constructor(private auth: AuthService, private db: DbService, public util: UtilService, public modalController: ModalController) { }

  ngOnInit() {
    console.log(this.idProfesor);
    console.log('la clase ',this.clase);
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

  async calificar(opinion) {
    const user = await this.auth.getUserData();
    if (user) {
      console.log(user);
      let url = 'calificar-profesor';
      if (user['tipo'] === 'Profesor') {
        url = 'calificar-alumno';
      }

      /**FIXME: preguntar que es el user_id_calif vs user_id */
      const data = {
        user_id: user.user_id,
        user_id_calif: this.idEstudiante ? this.idEstudiante : this.idProfesor,
        calificacion: this.rating,
        tarea_id: this.tarea,
        clase_id: this.clase,
        comment: opinion
      }

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
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
