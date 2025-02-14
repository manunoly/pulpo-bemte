import { AuthService } from './../../servicios/auth.service';
import { ChatPage } from './../../chat/chat.page';
import { MapPage } from './../../map/map.page';
import { ModalController, AlertController } from '@ionic/angular';
import { DbService } from './../../servicios/db.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UtilService } from '../../servicios/util.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-clase-detalles',
  templateUrl: './clase-detalles.page.html',
  styleUrls: ['./clase-detalles.page.scss'],
})
export class ClaseDetallesPage implements OnInit {
  urlPhoto;
  claseId;
  claseO;
  aplicadaProf;
  verDetalles = false;
  claseObjet = {
    "user_id": 24,
    "materia": "Economia",
    "tema": "mi tema eco",
    "fecha": "2019-08-27",
    "hora1": "07:00",
    "hora2": null,
    "personas": "1",
    "duracion": "2",
    "combo": "COMBO",
    "ubicacion": "El Comercio 125, Quito 170135, Ecuador",
    "coordenadas": '{"lat":-0.1754103046461042,"lng":-78.48091638172303}',
    "estado": "Sin_Pago",
    "seleccion_profesor": false,
    "activa": true,
    "horasCombo": null,
    "precioCombo": null,
    "updated_at": "2019-08-27 09:44:04",
    "created_at": "2019-08-27 09:44:04",
    "id": 64
  };

  constructor(private route: ActivatedRoute,
    private db: DbService,
    private modalController: ModalController,
    private alertController: AlertController,
    public util: UtilService,
    private router: Router,
    public auth: AuthService
  ) {
    this.urlPhoto = environment.photo_url;
  }

  async actualizar(event) {
    this.cargarClase();

    setTimeout(() => {
      event.target.complete();
    }, 600);

  }

  ionViewWillEnter() {
    this.claseId = this.route.snapshot.paramMap.get("id");
    this.cargarClase();
  }

  ngOnInit() { }

  cargarClase() {
    this.claseO = this.db.get('devuelve-clase?clase_id=' + this.claseId);
  }

  accionHoras($event) {
    console.log('la accion de las horas es', $event);
    if ($event)
      this.cargarClase();
    else if ($event == false)
      this.router.navigateByUrl('lista-clases');
  }


  async map(coordenadas) {
    const modal = await this.modalController.create({
      component: MapPage,
      componentProps: { ubicacion: JSON.parse(coordenadas) }
    });
    modal.onDidDismiss().then(data => console.log(data));
    return await modal.present();
  }

  async openChat(claseD) {

    const claseHora = new Date(Date.parse(claseD.fecha + 'T' + claseD.hora1));

    let anterior = new Date(claseHora);
    anterior.setHours(claseHora.getHours() - 1);

    const posterior = new Date(claseHora);
    // posterior.setHours(claseHora.getHours() + claseD.duracion + 1);

    const now = Date.now();

    console.log(anterior.getTime(), Date.now(), posterior.getTime());

    if (now > posterior.getTime())
      return this.util.showMessage('El chat no se encuentra activo para la clase.');

    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { clase: claseD, tipo: 'clase' }
    });
    return await modal.present();
  }

  async confirmarCancelar(clase, profesorD = 0) {
    if (!clase || clase == {})
      return;
    let msg;
    let estilo= 'fondoVerde alertDefault';
    if (profesorD)
      msg = `Se te descontarán 2 horas.`;
    else{
      msg = `Se te descontará 1 hora chaval.`;
      estilo = 'fondoVerde alertDefault'
    }
    const alert = await this.alertController.create({
      header: '¿Estás seguro que deseas cancelar?',
      subHeader: msg,
      cssClass: estilo,
      inputs: [
        {
          name: 'Si',
          type: 'radio',
          label: 'Si',
          value: true
        },
        {
          name: 'No',
          type: 'radio',
          label: 'No',
          value: false
        }],
      buttons: [{
        text: 'Aceptar',
        handler: (data) => {
          if (data)
            this.terminar(clase, profesorD);
        }
      }
      ]
    });

    await alert.present();
  }


  async terminar(clase, profesorD = 0) {
    try {
      this.util.showLoading();
      const user = await this.auth.getUserData();
      const resp = await this.db.post('clase-terminar', { clase_id: clase.id, user_id: user.user_id, cancelar: 1, profesor: profesorD });
      this.util.dismissLoading();
      this.db.setComboToBuy('');
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        if (user && user.tipo == 'Profesor')
          this.router.navigateByUrl('ganancias-profesor/MULTAS');
        else
          this.router.navigateByUrl('lista-clases/ANTERIOR');
      }
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  async aplicar(clases) {
    let estilo = 'fondoVerde alertDefault';
    let header = 'Aplicar';
    let msg = `Confirme desea aplicar a la clase!`;

    try {
      this.util.showLoading();
      const user = await this.auth.getUserData();

      const resp = await this.db.get(`verifica-horario-coincide?tarea_id=0&user_id=${user.user_id}&clase_id=${clases.id}`);
      this.util.dismissLoading();

      if (!resp) {
        estilo = 'fondoRojo alertDefault';
        header = 'Alerta';
        msg = 'Tiene una clase en ese horario, ¿Seguro desea aplicar?'
      }

    } catch (error) {
      return this.util.dismissLoading();
    }

    const alert = await this.alertController.create({
      header: header,
      subHeader: msg,
      cssClass: estilo,
      // inputs: [
      //   {
      //     name: 'hora1',
      //     type: 'radio',
      //     label: clases.hora1,
      //     value: clases.hora1
      //   }
      // ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Aplicar',
          handler: async (data) => {
            console.log(data);
            if (clases.hora1 == undefined)
              return this.util.showMessage('No hemos podido confirmar la hora');
            this.util.showLoading();
            let hora = clases.hora1;
            try {
              const user = await this.auth.getUserData();
              const postData = {
                user_id: user.user_id,
                clase_id: clases.id,
                hora: hora
              }
              console.log(postData);
              const resp = await this.db.post('aplicar-clase', postData);
              this.util.dismissLoading();
              if (resp && resp.success) {
                this.util.showMessage(resp.success);
                this.cargarClase();

                // this.util.setTemporalData({ data: clases, tipo: 'Clases' });
                // this.router.navigateByUrl('clase-aplicada-profesor');

                // const modal = await this.modalController.create({
                //   component: ClaseAplicadaProfesorPage,
                //   componentProps: { data: clases, tipo: 'Clases' }
                // });
                // modal.onDidDismiss().then(_ => {
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
  goToCancelada(clase) {
    if (clase.user_canc == clase.user_id_pro)
      this.router.navigateByUrl('ganancias-profesor/MULTAS');
    else
      this.util.atras();
  }

  detallesImg(tipo, avatar, calificacion, nombre, profClases?, profTareas?, profDescripccion?) {
    let data = {
      tipo: tipo,
      avatar: avatar ? this.urlPhoto + avatar : '/assets/icon/favicon.png',
      ranking: calificacion ? calificacion : 5,
      nombre: nombre,
      profClases: profClases,
      profTareas: profTareas,
      profDescripccion: profDescripccion
    }
    this.util.setTemporalData(data);
    this.router.navigateByUrl('/alumno-profesor-detalle');
  }
}
