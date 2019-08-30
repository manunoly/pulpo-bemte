import { AuthService } from './servicios/auth.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  user;

  public appPages = [];

  public inicio = [{
    title: 'Iniciar Sesión',
    url: '/login',
    icon: 'person'
  }];

  public profesorPages = [{
    title: 'Iniciar Sesión',
    url: '/login',
    icon: 'person'
  },
  {
    title: 'Solicitudes de Tareas',
    url: '/tareas-listado',
    icon: 'list'
  },
  {
    title: 'Mi perfil',
    url: '/perfil',
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
    },{
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth: AuthService,
    public menuCtrl: MenuController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkRoll();
    });
  }

  async checkRoll() {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (user)
        this.appPages = this.estudiantePages;
      else
        this.appPages = this.inicio;
    });
  }

  exit() {
    this.menuCtrl.toggle();
    this.auth.purgeAuth();

  }
}
