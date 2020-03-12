import { CalificarComponent } from './../share/calificar/calificar.component';
import { AuthService } from './../servicios/auth.service';
import { ChatPage } from './../chat/chat.page';
import { ModalController, AlertController } from '@ionic/angular';
import { DbService } from './../servicios/db.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../servicios/util.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tarea-detalles',
  templateUrl: './tarea-detalles.page.html',
  styleUrls: ['./tarea-detalles.page.scss'],
})
export class TareaDetallesPage implements OnInit {
  tareaId;
  tareaO;
  verDetalles;
  user;
  tareaPago;

  constructor(private route: ActivatedRoute,
    private db: DbService,
    private modalController: ModalController,
    private alertController: AlertController,
    public util: UtilService,
    private router: Router,
    private iab: InAppBrowser,
    public auth: AuthService
  ) { }

  ionViewWillEnter() {
    this.tareaId = this.route.snapshot.paramMap.get("id");
    this.cargarTarea();
    this.tareaPago = false;
  }

  async ngOnInit() {
    this.user = await this.auth.getUserData();
  }

  cargarTarea() {
    this.tareaO = this.db.get('devuelve-tarea?tarea_id=' + this.tareaId);
  }

  async confirmaPagarCombo(tarea) {
    const alert = await this.alertController.create({
      message: `Se te descontarán ${tarea.tiempo_estimado} horas de tu combo`,
      cssClass: 'fondoVerde alertDefault',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.pagarConCombo(tarea);
          }
        }
      ]
    });

    await alert.present();
  }

  async pagarConCombo(tarea) {
    try {
      this.util.showLoading();
      const resp = await this.db.post('pagar-con-combo', { user_id: this.user.user_id, tarea_id: tarea.id, clase_id: 0 })
      if (resp && resp.success)
        this.cargarTarea();
      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  accionHoras($event) {
    console.log('la accion de las horas es', $event);
    if ($event)
      this.cargarTarea();
    else if ($event == false)
      this.router.navigateByUrl('lista-tareas');
  }

  async openChat(tareaD) {

    // const tareaHora = new Date(Date.parse(tareaD.fecha_entrega + 'T' + tareaD.hora_inicio));

    // let anterior = new Date(tareaHora);

    // const tareaHoraFin = new Date(Date.parse(tareaD.fecha_entrega + 'T' + tareaD.hora_fin));

    // let posterior = new Date(tareaHoraFin);
    // posterior.setHours(posterior.getDate() + 1);

    // const now = Date.now();

    // console.log(anterior.getTime(), Date.now(), posterior.getTime());

    // if (now > posterior.getTime())
    //   return this.util.showMessage(`El chat estará activo hasta 24 horas después de la hora de entrega.`);

    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { tarea: tareaD, tipo: 'tarea' }
    });
    modal.onDidDismiss().then(data => {
      console.log('terminar', data);
      this.cargarTarea();
      if (data && data.data && data.data['terminar']) {
        setTimeout(() => {
          let url = 'calificaciones-alumno?user_id=';
          if (this.util.esProfesor){
            url = 'calificaciones-profesor?user_id=';
          }
          this.db.get(url + this.user.user_id).then(calificar => {
            if (calificar.clase_id != 0) {
              this.calificar(calificar['clase'], 'clase');
            } else if (calificar.tarea_id != 0) {
              this.calificar(calificar['tarea'], 'tarea');
            }
          }).catch();

        }, 1000);
      }

    });
    return await modal.present();
  }

  async calificar(data, tipoD) {
    const modal = await this.modalController.create({
      component: CalificarComponent,
      componentProps: { calificarData: data, tipo: tipoD }
    });
    modal.onDidDismiss().then(data => console.log(data));
    return await modal.present();
  }

  async confirmarCancelar(tarea, profesorD = 0) {
    const alert = await this.alertController.create({
      header: 'Cancelar!',
      message: 'Está seguro que desea cancelar? Puede implicar una penalización!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'fondoRojo alertRojo',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.terminar(tarea, profesorD);
          }
        }
      ]
    });

    await alert.present();
  }

  async terminar(tarea, profesorD = 0) {
    try {
      this.util.showLoading();
      const user = await this.auth.getUserData();
      const resp = await this.db.post('tarea-terminar', { clase_id: 0, tarea_id: tarea.id, user_id: user.user_id, cancelar: 1, profesor: profesorD });
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.util.atras();
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  verificarProfeAplicado(profes) {
    if (profes.includes(this.user.user_id))
      return true;
    return false;
  }

  async aplicar(tarea) {
    this.util.showMessage('Solo números enteros entre 1 y 40');

    const alert = await this.alertController.create({
      header: 'Aplicar a la tarea',
      subHeader: `¿Cuánto te demoras?   (Ingresar números enteros)`,
      cssClass: 'inputBlancoGrande fondoAzul alertDefaultBotonVerde',
      inputs: [
        {
          name: 'tiempo',
          type: 'number',
          min: 0
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Aplicar',
          handler: async (data) => {

            // poner Numeros en blanco. mas grande Validar sean numeros enteros y redondear 

            if (!data || !data.tiempo)
              return this.util.showMessage('Por favor revisar los datos ingresados');

            let tiempo;

            if (!Number.isInteger(Number(data.tiempo))) {
              this.util.showMessage('Su valor será convertido a entero');
              tiempo = Math.round(data.tiempo);
            } else
              tiempo = data.tiempo;

            if (tiempo < 1 || tiempo > 40)
              return this.util.showMessage('El tiempo debe estar entre 1 y 40');

            this.util.showLoading();
            try {
              const user = await this.auth.getUserData();
              const postData = {
                user_id: user.user_id,
                tarea_id: tarea.id,
                ...data
              }
              console.log(postData);
              const resp = await this.db.post('aplicar-tarea', postData);
              this.util.dismissLoading();
              if (resp && resp.success) {
                this.util.showMessage(resp.success);
                // this.cargarTarea();
                this.util.atras();
                // this.util.setTemporalData({ data: tarea, tipo: 'Tareas' });
                // this.router.navigateByUrl('clase-aplicada-profesor');
                // const modal = await this.modalController.create({
                //   component: ClaseAplicadaProfesorPage,
                //   componentProps: { data: tarea, tipo: 'Tareas' } 
                // });
                // modal.onDidDismiss().then(data => {
                //   this.util.atras();
                // });
                // return await modal.present();
              }
            } catch (error) {
              console.log(error);
              this.util.dismissLoading();
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async descargarArchivo(archivo) {
    if (!archivo)
      return;
    this.iab.create(this.db.photoUrl + archivo, '_system');
  }

  goToCancelada(tarea) {
    if (tarea.user_canc == tarea.user_id_pro)
      this.router.navigateByUrl('ganancias-profesor/MULTAS');
    else
      this.util.atras();
  }

  detallesImg(tipo, avatar, calificacion, nombre, profClases?, profTareas?, profDescripccion?) {
    let data = {
      tipo: tipo,
      avatar: avatar ? this.util.photoUrl + avatar : '/assets/icon/favicon.png',
      ranking: calificacion ? calificacion : 5,
      nombre: nombre,
      profClases: profClases,
      profTareas: profTareas,
      profDescripccion: profDescripccion
    }
    this.util.setTemporalData(data);
    this.router.navigateByUrl('/alumno-profesor-detalle');
  }

  async actualizar(event) {
    this.cargarTarea();
    this.tareaPago = false;
    setTimeout(() => {
      event.target.complete();
    }, 600);

  }
}
