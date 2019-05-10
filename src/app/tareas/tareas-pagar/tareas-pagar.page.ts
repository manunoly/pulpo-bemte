import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tareas-pagar',
  templateUrl: './tareas-pagar.page.html',
  styleUrls: ['./tareas-pagar.page.scss'],
})
export class TareasPagarPage implements OnInit {

  constructor(public auth: AuthService, private db: DbService, private router: Router, public util: UtilService) { }

  ngOnInit() {
  }

  confirmarPago(){
    this.util.showMessage('confirmar');
  }

  atras() {
    this.router.navigateByUrl('tarea-estado');
  }

  subir(){
    this.util.showMessage('en construcción');
  }

}
