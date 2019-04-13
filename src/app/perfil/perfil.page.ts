import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario = {
    foto: '/assets/img/logo.png',
    nombre: 'señor estimado',
    apodo: 'señor x',
    telefono: '98798798',
    email: 'email@pulpo.ec',
    direccion: 'pulpo.ec',
    universidad: 'Udla'
  }
  constructor() { }

  ngOnInit() {
  }

}
