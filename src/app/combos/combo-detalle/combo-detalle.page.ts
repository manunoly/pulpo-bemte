import { UtilService } from './../../servicios/util.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-combo-detalle',
  templateUrl: './combo-detalle.page.html',
  styleUrls: ['./combo-detalle.page.scss'],
})
export class ComboDetallePage implements OnInit {
  combo;
  constructor(private route: ActivatedRoute, private util: UtilService) { }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('combo');
    if (!param) {
      this.util.showMessage('No se ha podido obtener los datos del combo el combo');
    } else
    this.combo = JSON.parse(param);
  }

}
