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

  @Input() clase_tarea: any;  
  @Output('accion')
  change: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private util:UtilService, private db: DbService, private auth: AuthService) { }

  async ngOnInit() {
    this.horas = this.db.get('combo-horas');
    console.log('clase_tarea', this.clase_tarea);
  }

  seleccionaHora(horaSeleccionada) {
    this.horaSeleccionada = horaSeleccionada;
  }

  async confirmarCombo(accion) {
    if (accion) {
      try {
        const user = await this.auth.getUserData();
        if (user) {
          const resp = await this.db.post('combo-compra', {
            user_id: user.user_id,
            valor: this.horaSeleccionada.descuento,
            horas: this.horaSeleccionada.hora
          });
          if (resp && resp.success){
            this.util.showMessage(resp.success);
            this.change.emit(true);
          }
        }
      } catch (error) {

      }
    } else {
      this.change.emit(false);
    }
  }
}
