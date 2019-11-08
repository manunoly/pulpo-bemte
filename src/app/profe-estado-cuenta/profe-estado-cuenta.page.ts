import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profe-estado-cuenta',
  templateUrl: './profe-estado-cuenta.page.html',
  styleUrls: ['./profe-estado-cuenta.page.scss'],
})
export class ProfeEstadoCuentaPage implements OnInit {
  estado;
  nombre;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.estado, this.nombre);
  }


}
