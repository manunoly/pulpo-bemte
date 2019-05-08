import { UtilService } from './../../servicios/util.service';
import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.page.html',
  styleUrls: ['./estado.page.scss'],
})
export class EstadoPage implements OnInit {

  constructor(public auth: AuthService, private db: DbService, private router: Router,  public util: UtilService) { }

  ngOnInit() {
  }

  atras() {
    this.router.navigateByUrl('inicio');
  }

}
