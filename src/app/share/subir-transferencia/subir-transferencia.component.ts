import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { UploadService } from 'src/app/servicios/upload.service';
import { UtilService } from 'src/app/servicios/util.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as $ from "jquery";
//import * as postscribe from 'postscribe'
import postscribe from 'postscribe';

@Component({
  selector: 'app-subir-transferencia',
  templateUrl: './subir-transferencia.component.html',
  styleUrls: ['./subir-transferencia.component.scss'],
})
export class SubirTransferenciaComponent implements OnInit {
  segmentModel = 'transferencia';
  img;
  bemteTransaccionId;
  user;
  @Input() clase_id = 0;
  @Input() tarea_id = 0
  @Input() combo = 0
  @Input() total = 0;
  @Output('accion')  change: EventEmitter<boolean> = new EventEmitter<boolean>();
  pago = false;
  config = false;
  cardForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16)
    ]),
    expiration: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    ]),
    securityCode: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)
    ])
  });

  constructor(public upload: UploadService, public util: UtilService, public auth: AuthService, public db: DbService,private _ngZone: NgZone) { 
    window['angularComponentRef'] = {component: this, zone: _ngZone};
  }

  
  async ngOnInit() {
    window['my'] = window['my'] || {};
    window['my'].namespace = window['my'].namespace || {};
    window['my'].namespace.iniciarTransaccion = this.iniciarTransaccion.bind(this);
    window['my'].namespace.finTransaccion = this.finTransaccion.bind(this);
    this.total = parseInt(this.total ? this.total : -1 as any);
    window['my'].namespace.total = this.total;
    this.user = await this.auth.getUserData();
    window['my'].namespace.user = this.user;
    //console.log('horas a pagar', this.total);

  }

  ngOnDestroy(){
    console.log('destroy component');
    if($('#postscribediv').length > 0) {
      $('#postscribediv').remove();
      delete window['my'];
    }
  }

  async subir() {
    try {
      this.upload.imagesSubject.subscribe(img => this.img = img);
      await this.upload.selectImage();
    } catch (error) {
    }
  }

  async uploadData() {
    const user = await this.auth.getUserData();
    if (!user) {
      return this.util.showMessage('No hemos podido obtener los datos del usuario');
    }
    let data = {
      user_id: user.user_id,
      tarea_id: this.tarea_id,
      clase_id: this.clase_id,
      combo_id: '0'
    }
    if (this.tarea_id == 0 && this.clase_id == 0) {
      data['combo_id'] = 'COMBO';
      data['valor'] = this.combo['descuento'];
      data['horas'] = this.combo['hora'];;
    }

    try {
      if (this.img.length > 0) {
        data['archivo'] = this.img[0].name;
        await this.upload.startUpload();
      }

      else {
        this.util.showMessage('Por favor adjuntar imagen de pago');
        return;
      }

      const resp = await this.db.post('subir-transferencia', data);
      if (resp && resp.success) {
        setTimeout(() => {
          this.util.showMessage(resp.success);
          this.change.emit(true);
        }, 2000);
      } else {
        setTimeout(() => {
          this.change.emit(false);
        }, 2000);
      }

      this.util.dismissLoading();
    } catch (error) {
      this.util.dismissLoading();
    }
  }

  onResetClick() {
    this.cardForm.reset();
  }
  pagarCredito(){
    console.log(this.cardForm.value);
  }
  segmentChanged(ev: any) {
    //console.log('Segment changed', ev);
    setTimeout(() => {
      window['angularComponentRef'].zone.run(()=>{
        //console.log(postscribe);
        this.pay();
      })
    }, 100);
  }

  done(){
    this.change.emit(true);
  }



  public async iniciarTransaccion(){
    console.log('iniciar transaccion');
    const user = await this.auth.getUserData();
    if (!user) {
      return this.util.showMessage('NO realizar pago, No hemos podido obtener los datos del usuario');
    }
    await this.util.showLoading();
    let data = {
      user_id: user.user_id,
      tarea_id: this.tarea_id,
      clase_id: this.clase_id,
      combo_id: '0'
    }
    if (this.tarea_id == 0 && this.clase_id == 0) {
      data['combo_id'] = 'COMBO';
      data['valor'] = this.combo['descuento'];
      data['horas'] = this.combo['hora'];
    }
    try {
      const resp = await this.db.post("inicioTransaccion",data);
      //this.bemteTransaccionId = resp.transaccion_id;
      this.bemteTransaccionId = resp.id;
      window['my'].namespace.bemteTransaccionId = this.bemteTransaccionId.toString();
      this.util.dismissLoading();
    } catch (e) {
      this.util.dismissLoading();
      this.util.showMessage('Hemos tenido un problema, NO realizar pago');
    }
  }


  public async finTransaccion(response){
    console.log('fin transaccion', response);
    const user = await this.auth.getUserData();
    if (!user) {
      return this.util.showMessage(`Hemos tenido un problema, Bemte transaccion ${this.bemteTransaccionId}`);
    }
    //respuesta success
    // response = {
    //   "transaction":{
    //       "status": "success", 
    //       "id": "CB-81011", 
    //       "status_detail": 3
    //   }
    // };
    //respuesta de error
    // response = {
    //   "error": {
    //     "type": "Server Error",
    //     "help": "Try Again Later",
    //     "description": "Sorry, there was a problem loading Checkout."
    //   }
    // }
    if(response && response.error){
      return this.util.showMessage(`Hemos tenido un problema procesando el pago, ${response.error.description}, Bemte transaccion ${this.bemteTransaccionId}`);
    }

    if(response && response.hasOwnProperty("card") && response.hasOwnProperty("transaction")){
      let data = {
        id: this.bemteTransaccionId,
        user_id: user.user_id,
        tarea_id: this.tarea_id,
        clase_id: this.clase_id,
        combo_id: '0',
        total: this.total,
        description: 'pago bemte',
        number_card: response.card.number,
        status: response.transaction.status_detail,
        holder_name: 'holder_name',
        //datos de respuesta paymentez
        //id: response.transaction.id, 
        paymentez_transaction: JSON.stringify(response.transaction),
        paymentez_card: JSON.stringify(response.card),
      }
      if (this.tarea_id == 0 && this.clase_id == 0) {
        data['combo_id'] = 'COMBO';
        data['total'] = this.combo['descuento'];
      }
      try {
        await this.util.showLoading();
        const resp = await this.db.post("finTransaccion", data);
        //this.bemteTransaccionId = resp.transaccion_id;
        //this.util.showMessage('Transacción exitosa');
        let msg = '';
        let fondo = 'fondoVerde alertDefault notificacionStyle';
        if (this.tarea_id == 0 && this.clase_id == 0) {
          msg = 'En breves momentos vamos a acreditar tus horas';
        }else{
          if(this.clase_id != 0){
            msg = ' para su clase.';
          }
          if(this.tarea_id != 0){
            msg = ' para su tarea.';
          }
        }
        switch (response.transaction.status_detail) {
          case 3:
            msg = 'Tu transacción ha sido aceptada. '.concat(msg);
            break;
          case 9:
            msg = 'Tu tarjeta ha sido rechazada, comunícate con tu banco para obtener mas información';
            fondo = 'fondoRojo alertDefault';
            break;
          case 1:
            msg = 'Tu transacción se encuentra pendiente de aprobación, '.concat(msg);
            break;
          case 11:
            msg = 'Tu tarjeta ha sido rechazada, comunícate con tu banco para obtener mas información';
            fondo = 'fondoRojo alertDefault';
            break;
          case 12:
            msg = 'Tu tarjeta ha sido rechazada, comunícate con tu banco para obtener mas información';
            fondo = 'fondoRojo alertDefault';
            break;
          default:
            msg = 'Estado de transacción desconocida';
        }

        setTimeout(async () => {
          await this.util.presentAlert(msg, 'Transacción', ['Aceptar'], '', fondo);
          //await this.util.presentAlert(`<h3>Transacción ${status}, Bemte id: ${this.bemteTransaccionId}, Pago id transaccion: ${response.transaction.id}</h3>`, 'Importante');
        }, 1000);
        if(response.transaction.status_detail == 1 || response.transaction.status_detail == 3){
          setTimeout(() => {
            this.change.emit(true);
          }, 100);
        }
        this.util.dismissLoading();
      } catch (e) {
        document.getElementById('response').innerHTML = `<h3>Error en Bemte transaccion id: ${this.bemteTransaccionId}, Pago id transaccion: ${response.transaction.id}, REPORTAR!!</h3>`;
        this.util.showMessage(`Hemos tenido un problema, Bemte transaccion ${this.bemteTransaccionId}`);
      }
    }

  }

  async pay(){
    console.log($('#postscribediv').length);
      $("body").append("<div id='postscribediv'>");
     // `prod`, `stg`, `local` to change environment. Default is `stg`
      postscribe('#postscribediv', `<script>
      window['angularComponentRef']['paymentCheckout'] = new PaymentCheckout.modal({
        client_app_code: 'TPP3-EC-CLIENT', // Client Credentials
        client_app_key: 'ZfapAKOk4QFXheRNvndVib9XU3szzg', // Client Credentials
        // client_app_code: 'BEMTEBEMYTEACHERSAS-EC-CLIENT', // Client Credentials
        // client_app_key: 'rreeVtXg0LtLmqSHnSHF4hfT1PsTo0', // Client Credentials
        locale: 'es', // User's preferred language (es, en, pt). English will be used by default.
        env_mode: 'stg',
        // env_mode: 'prod',
        onOpen: function () {
          console.log('modal open');
          //window['angularComponentRef'].component.iniciarTransaccion().then((value) => {}).catch((err) => {});
        },
        onClose: function () {
          console.log('modal closed');
          //window['angularComponentRef'].component.finTransaccion('close modal').then((value) => {}).catch((err) => {});

        },
        onResponse: function (response) { // The callback to invoke when the Checkout process is completed
          console.log('response', response);
          window['angularComponentRef'].component.finTransaccion(response).then((value) => {}).catch((err) => {});
          
          /*
            In Case of an error, this will be the response.
            response = {
              "error": {
                "type": "Server Error",
                "help": "Try Again Later",
                "description": "Sorry, there was a problem loading Checkout."
              }
            }
    
            When the User completes all the Flow in the Checkout, this will be the response.
            response = {
              "transaction":{
                  "status": "success", // success or failure
                  "id": "CB-81011", // transaction_id
                  "status_detail": 3 // for the status detail please refer to: https://paymentez.github.io/api-doc/#status-details
              }
            }
          */
          //console.log('modal response');
          //document.getElementById('response').innerHTML = JSON.stringify(response);
        }
      });
    
      window['angularComponentRef']['btnOpenCheckout'] = document.querySelector('.js-payment-checkout');
      window['angularComponentRef']['btnOpenCheckout'].addEventListener('click', function () {
        window['angularComponentRef'].component.iniciarTransaccion().then((value) => {
          window['angularComponentRef']['paymentCheckout'].open({
            user_id: window['my'].namespace.user.user_id.toString(),
            user_email: window['my'].namespace.user.correo, //optional
            user_phone: window['my'].namespace.user.celular, //optional
            order_description: 'pago bemte',
            order_amount: window['my'].namespace.total,
            order_vat: 0,
            order_reference: window['my'].namespace.bemteTransaccionId,
            //order_installments_type: 2, // optional: The installments type are only available for Ecuador and Mexico. The valid values are: https://paymentez.github.io/api-doc/#payment-methods-cards-debit-with-token-base-case-installments-type
            order_taxable_amount: 0, // optional: Only available for Ecuador. The taxable amount, if it is zero, it is calculated on the total. Format: Decimal with two fraction digits.
            order_tax_percentage: 0 // optional: Only available for Ecuador. The tax percentage to be applied to this order.
          });
        }).catch((err) => {});
      });
    
      window.addEventListener('popstate', function () {
        window['angularComponentRef']['paymentCheckout'].close();
      });
</script>`)
}

}
