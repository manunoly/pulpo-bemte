import { UtilService } from './../../servicios/util.service';
import { AuthService } from './../../servicios/auth.service';
import { DbService } from './../../servicios/db.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-horas-seleccionar',
  templateUrl: './horas-seleccionar.component.html',
  styleUrls: ['./horas-seleccionar.component.scss'],
})
export class HorasSeleccionarComponent implements OnInit {
  horas;
  horaSeleccionada;

  @Input() clase_id = 0;
  @Input() tarea_id = 0
  @Output('accion')
  change: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private util: UtilService, private db: DbService, private auth: AuthService) { }

  async ngOnInit() {
    this.horas = this.db.get('combo-horas');
    console.log('clase_id', this.clase_id);
    console.log('tarea_id', this.tarea_id);
  }

  seleccionaHora(horaSeleccionada) {
    this.horaSeleccionada = horaSeleccionada;
  }

  async confirmarCombo(accion) {
    if (accion) {
      try {
        if (this.clase_id == 0 && this.tarea_id == 0)
          return this.change.emit(this.horaSeleccionada);

        const user = await this.auth.getUserData();
        if (user) {
          let data = {
            user_id: user.user_id,
            valor: this.horaSeleccionada.descuento,
            horas: this.horaSeleccionada.hora,
            clase_id: this.clase_id,
            tarea_id: this.tarea_id
          };

          const resp = await this.db.post('combo-compra', data);
          if (resp && resp.success) {
            this.util.showMessage(resp.success);
            this.change.emit(true);
          }
        } else {
          this.util.showMessage('No hemos podido obtener los datos del usuario, favor iniciar sesión');
        }

      } catch (error) {

      }
    } else {
      this.change.emit(false);
    }
  }
}
