import { AuthService } from './../servicios/auth.service';
import { ChatPage } from './../chat/chat.page';
import { ModalController, AlertController } from '@ionic/angular';
import { DbService } from './../servicios/db.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../servicios/util.service';

@Component({
  selector: 'app-tarea-detalles',
  templateUrl: './tarea-detalles.page.html',
  styleUrls: ['./tarea-detalles.page.scss'],
})
export class TareaDetallesPage implements OnInit {
  tareaId;
  tareaO;
  verDetalles;

  constructor(private route: ActivatedRoute,
    private db: DbService,
    private modalController: ModalController,
    private alertController: AlertController,
    public util: UtilService,
    private router: Router,
    public auth: AuthService
  ) { }

  ionViewWillEnter() {
    this.tareaId = this.route.snapshot.paramMap.get("id");
    this.cargarTarea();
  }

  ngOnInit() {
  }

  cargarTarea() {
    this.tareaO = this.db.get('devuelve-tarea?tarea_id=' + this.tareaId);
  }

  accionHoras($event) {
    console.log('la accion de las horas es', $event);
    if ($event)
      this.cargarTarea();
    else if ($event == false)
      this.router.navigateByUrl('lista-tareas');
  }

  async openChat(tareaD) {

    const tareaHora = new Date(Date.parse(tareaD.fecha_entrega + 'T' + tareaD.hora_inicio));

    let anterior = new Date(tareaHora);

    const tareaHoraFin = new Date(Date.parse(tareaD.fecha_entrega + 'T' + tareaD.hora_fin));

    let posterior = new Date(tareaHoraFin);
    posterior.setHours(posterior.getDate() + 1);

    const now = Date.now();

    // console.log(anterior.getTime(), Date.now(), posterior.getTime());

    // if (anterior.getTime() > now || now > posterior.getTime())
    //   return this.util.showMessage(`El chat estará activo hasta 24 horas después de la hora de entrega.`);

    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { tarea: tareaD, tipo: 'tarea' }
    });
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

  async aplicar(tarea) {
    const alert = await this.alertController.create({
      header: 'Aplicar a la tarea',
      subHeader: '¿Cuánto te demoras?',
      cssClass: 'fondoAzul alertDefaultBotonVerde',
      inputs: [
        {
          name: 'tiempo',
          type: 'number',
          placeholder: 'Tiempo en horas de la tarea',
          min: 0
        },
        {
          name: 'inversion',
          type: 'number',
          placeholder: 'Costo de la tarea',
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
            if (!data || !data.tiempo || !data.inversion)
              return this.util.showMessage('Por favor revisar los datos ingresados');

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

                this.util.setTemporalData({ data: tarea, tipo: 'Tareas' });
                this.router.navigateByUrl('clase-aplicada-profesor');
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

  async descargarArchivo(tarea) {
    this.util.showMessage('Descargar Archivo');
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

    setTimeout(() => {
      event.target.complete();
    }, 600);

  }
}
