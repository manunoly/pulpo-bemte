import { DbService } from './../../servicios/db.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/servicios/util.service';

@Component({
  selector: 'app-combo-hora',
  templateUrl: './combo-hora.page.html',
  styleUrls: ['./combo-hora.page.scss'],
})
export class ComboHoraPage implements OnInit {
  combo;
  horas;
  horaSeleccionada;
  confirmar = false;
  
  constructor(private route: ActivatedRoute, private util: UtilService, private db: DbService) { }

  async ngOnInit() {

    const param = this.route.snapshot.paramMap.get('combo');
    if (!param) {
      this.util.showMessage('No se ha podido obtener los datos del combo el combo');
    } else
      this.combo = param;
    this.horas = this.db.get('combo-horas?combo=' + this.combo);
    console.log(await this.db.get('combo-horas?combo=' + this.combo));
  }

  confirmarHora() {
    
    this.util.showMessage("Si, vamos a confirmar la hora");
  }
}
