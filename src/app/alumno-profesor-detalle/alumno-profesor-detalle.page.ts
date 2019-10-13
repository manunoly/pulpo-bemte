import { AuthService } from './../servicios/auth.service';
import { UtilService } from 'src/app/servicios/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alumno-profesor-detalle',
  templateUrl: './alumno-profesor-detalle.page.html',
  styleUrls: ['./alumno-profesor-detalle.page.scss'],
})
export class AlumnoProfesorDetallePage implements OnInit {
  data;
  profesor = false;

  constructor(public util: UtilService, public auth: AuthService) { }

  ngOnInit() {
    this.data = this.util.getTemporalData();
    console.log(this.data);
    if(!this.data)
      this.util.atras();
  }

}
