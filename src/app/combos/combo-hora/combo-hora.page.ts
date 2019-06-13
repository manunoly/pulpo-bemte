import { AuthService } from './../../servicios/auth.service';
import { UploadService } from './../../servicios/upload.service';
import { DbService } from './../../servicios/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/servicios/util.service';
import { Location } from '@angular/common';

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
  pagarCombo;

  constructor(public auth: AuthService, public upload: UploadService, private router: Router, private navigation: Location, private route: ActivatedRoute, private util: UtilService, private db: DbService) { }

  async ngOnInit() {

    const param = this.route.snapshot.paramMap.get('combo');
    if (!param) {
      this.util.showMessage('No se ha podido obtener los datos del combo el combo');
    } else
      this.combo = param;
    this.horas = this.db.get('combo-horas?combo=' + this.combo);
  }

  confirmarHora() {
    let combo = this.db.getComboToBuy();
    if(!combo)
      combo = {};
    combo['combo'] = this.combo;
    combo['horas'] = this.horaSeleccionada.hora;
    combo['precio'] = this.horaSeleccionada.inversion;
    this.db.setComboToBuy(combo);
    if (combo['type'] && combo['type'] == 'tareas')
      this.pagarCombo = true;
    else
      this.router.navigateByUrl('clases', { queryParams: { hora: this.horaSeleccionada, combo: this.combo } });

  }

  async pagarComboConTransferencia(){
    const user = await this.auth.getUserData();
    if (!user) {
      this.util.showMessage('No hemos podido tener los datos del usuario');
      return;
    }
    const combo = this.db.getComboToBuy();
    const data = {
      combo_id: this.combo,
      user_id: user.user_id,
      tarea_id: combo.id,
      clase_id: 0,
      archivo: 'noArchivo.png',
      drive: null,
      horas: combo.horas,
      valor: combo.precio
    };
    try {
      this.util.showLoading();
      const resp = await this.db.post('subir-transferencia', data);
      this.util.dismissLoading();
      if (resp && resp.success)
        this.router.navigateByUrl('tareas', { queryParams: { hora: this.horaSeleccionada, combo: this.combo } });
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  atras() {
    this.navigation.back();
  }

}
