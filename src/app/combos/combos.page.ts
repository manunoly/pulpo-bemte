import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-combos',
  templateUrl: './combos.page.html',
  styleUrls: ['./combos.page.scss'],
})
export class CombosPage implements OnInit {
  combos;

  constructor(public auth: AuthService, private db: DbService) { }

  async ngOnInit() {
    this.combos = this.db.get('lista-combos');
    console.log(this.combos);
  }

}
