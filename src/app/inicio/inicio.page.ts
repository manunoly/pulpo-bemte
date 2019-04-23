import { AuthService } from './../servicios/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit() {

  }

  goTo(url){
    this.router.navigateByUrl(url);
  }
}
