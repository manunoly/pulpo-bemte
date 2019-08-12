import { DbService } from './../servicios/db.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clase-gratis',
  templateUrl: './clase-gratis.page.html',
  styleUrls: ['./clase-gratis.page.scss'],
})
export class ClaseGratisPage implements OnInit {
  clases;

  constructor(public auth: AuthService, private db: DbService) { }

  ngOnInit() {
    this.clases = this.db.get('clases-gratis');
  }

  goto(url){
    window.location.assign(url);
  }
}
