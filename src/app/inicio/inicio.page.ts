import { ModalController } from '@ionic/angular';
import { AuthService } from './../servicios/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MapPage } from '../map/map.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private router: Router, public auth: AuthService, private modalController: ModalController) { }

  ngOnInit() {

  }

  goTo(url){
    this.router.navigateByUrl(url);
  }

  async map(){
    const modal = await this.modalController.create({
      component: MapPage, 
      // componentProps: { ubicacion: { lat: -0.1740159, lng: -78.463816299 } }
    });
    modal.onDidDismiss().then(data=>console.log(data))
    return await modal.present();
  }
}
