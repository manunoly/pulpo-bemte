import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    }, {
      title: 'Iniciar Sesión',
      url: '/login',
      icon: 'person'
    },
    {
      title: 'Clases',
      url: '/clases',
      icon: 'list'
    },
    {
      title: 'Combos',
      url: '/combos',
      icon: 'list'
    },
    {
      title: 'Mi perfil',
      url: '/perfil',
      icon: 'man'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
