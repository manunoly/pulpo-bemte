import { AuthService } from './servicios/auth.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  user;
  public appPages = [];
  public profesorPages = [
    {
      title: 'Solicitudes de Tareas',
      url: '/tareas-listado',
      icon: 'list'
    },
    {
      title: 'Mis Tareas',
      url: '/lista-tareas',
      icon: 'list'
    },
    {
      title: 'Solicitudes de Clases',
      url: '/clases-listado',
      icon: 'list'
    },
    {
      title: 'Mis Clases',
      url: '/lista-clases',
      icon: 'list'
    },
    {
      title: 'Ganancias',
      url: '/ganancias-profesor',
      icon: 'man'
    }];

  public estudiantePages = [
    {
      title: 'Mis Clases',
      url: '/lista-clases',
      icon: 'list'
    },
    {
      title: 'Mis Tareas',
      url: '/lista-tareas',
      icon: 'list'
    },
    {
      title: 'Mi Billeta',
      url: '/billetera-estudiante',
      icon: 'logo-usd'
    }, {
      title: 'Clase gratis',
      url: '/clase-gratis',
      icon: 'school'
    },
    {
      title: 'Ayuda',
      url: '/ayuda',
      icon: 'help'
    }

  ];
  showSplash = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth: AuthService,
    public menuCtrl: MenuController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      setTimeout(() => {
        this.showSplash = false;
      }, 4200);
      this.checkRoll();
    });
  }

  async checkRoll() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user && user.tipo == 'Profesor')
        this.appPages = this.profesorPages;
      else
        this.appPages = this.estudiantePages;
    });
  }

  goTo(url) {
    console.log(url);
    this.router.navigateByUrl(url);
  }

  exit() {
    this.menuCtrl.toggle();
    this.auth.purgeAuth();

  }
}
