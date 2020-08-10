import { AuthService } from './servicios/auth.service';
import { Component, ViewChild } from '@angular/core';

import { Platform, IonFab } from '@ionic/angular';
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
  @ViewChild(IonFab) fab;

  public appPages = [];
  public profesorPages = [
    {
      title: 'Información',
      url: '/informacion',
      icon: 'info_prof.png'
    },
    {
      title: 'Mis Clases',
      url: '/lista-clases',
      icon: 'clases_prof.png'
    },
    {
      title: 'Mis Tareas',
      url: '/lista-tareas',
      icon: 'tareas_prof.png'
    },
    {
      title: 'Billetera',
      url: '/ganancias-profesor',
      icon: 'billetera_prof.png'
    }];

  public estudiantePages = [
    {
      title: 'Información',
      url: '/informacion',
      icon: 'info_est.png'
    },
    {
      title: 'Clase Gratis',
      url: '/clase-gratis',
      icon: 'clases-free_est.png'
    },
    {
      title: 'Billetera',
      url: '/billetera-estudiante',
      icon: 'billetera_est.png'
    },
    {
      title: 'Mis Clases',
      url: '/lista-clases',
      icon: 'clases_est.png'
    },
    {
      title: 'Mis Tareas',
      url: '/lista-tareas',
      icon: 'tareas_est.png'
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

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#A7BF30");
      this.statusBar.styleLightContent();

      setTimeout(() => {
        this.showSplash = false;
      }, 4000);

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
    this.router.navigateByUrl(url);
  }

  closeMenu(){
    if(this.fab && this.fab.activated)
      this.fab.close();
  }

  exit() {
    this.menuCtrl.toggle();
    this.auth.purgeAuth();

  }
}
