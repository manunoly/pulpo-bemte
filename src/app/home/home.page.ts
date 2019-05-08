import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user;

  constructor(public alertController: AlertController, private router: Router, private auth: AuthService) { }

  async ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      console.log(user);
      this.user = user;
    })
  }

  ir(url) {
    this.router.navigateByUrl(url);
  }

}
