import { UtilService } from './../servicios/util.service';
import { AuthService } from './../servicios/auth.service';
import { DbService } from './../servicios/db.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billetera-estudiante',
  templateUrl: './billetera-estudiante.page.html',
  styleUrls: ['./billetera-estudiante.page.scss'],
})
export class BilleteraEstudiantePage implements OnInit {
  horasCombos;
  horasComprar;
  confirmandoPago = false;

  constructor(public auth: AuthService, private db: DbService, public util: UtilService) { }

  async ngOnInit() {
    const user = await this.auth.getUserData();
    this.horasCombos = await this.db.get('horas-totales?user_id=' + user['user_id']);
  }

  setHoras($event) {
    this.horasComprar = $event;
    console.log(this.horasComprar);
  }

  pagadasHoras(estado) {
    if (estado)
      this.confirmandoPago = true;
    else {
      this.horasComprar = '';
      this.confirmandoPago = false;
    }
  }

}
