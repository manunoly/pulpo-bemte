import { ModalController } from '@ionic/angular';
import { UtilService } from './../../servicios/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
})
export class TerminosPage implements OnInit {
  terminos = `
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


  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  back(ok?) {
    this.modalController.dismiss(ok);
  }

}
