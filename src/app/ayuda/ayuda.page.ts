import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {
  ayuda = `
  <ul>
  <li> bla bla bla 4to nivel. PHD / Master</li>
  <li>Experiencia catedr&aacute;tica</li>
  <li>Dominio de la Materia</li>
  <li>Clases Personalizadas</li>
  <li>Clase a domicilio / Lugar de preferencia</li>
  <li>Elecci&oacute;n de horario a su gusto</li>
  <li>Servicio VIP</li>
  <li>Surprise Gift</li>
  <li>Las horas de tu Combo pueden ser utilizadas en Proyectos o Clases</li>
  </ul>`;
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  goto(){
    window.location.assign('https://youtube.com');
  }

}
