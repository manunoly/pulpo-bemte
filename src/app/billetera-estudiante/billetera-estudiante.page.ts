import { Router } from '@angular/router';
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

  constructor(private router: Router, public auth: AuthService, private db: DbService) { }

  async ngOnInit() {
    const user = await this.auth.getUserData();
    this.horasCombos = await this.db.get('horas-totales?user_id=' + user['user_id']);
  }

  recargarCombos() {
    this.db.setComboToBuy('');
    this.router.navigateByUrl('combos');
  }

  setHoras($event) {
    this.horasComprar = $event;
    console.log(this.horasComprar);
  }

  pagadasHoras(estado) {
    if (estado)
      this.router.navigateByUrl('inicio');
    else
      this.horasComprar = '';
  }
}
