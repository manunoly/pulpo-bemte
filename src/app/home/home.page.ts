import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  async ngOnInit() {
  }

  goTo() {
    const user = this.auth.getUserData();
    if (user && user['tipo'] == 'Profesor')
      this.router.navigateByUrl('inicio-profesor');
    else if (user && user['tipo'] == 'Alumno')
      this.router.navigateByUrl('inicio');
    else
      this.router.navigateByUrl('login');


  }
}
