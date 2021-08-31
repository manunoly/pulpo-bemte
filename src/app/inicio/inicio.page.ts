import { DbService } from 'src/app/servicios/db.service';
import { UtilService } from "src/app/servicios/util.service";
import { FcmService } from "./../servicios/fcm.service";
import { AuthService } from "./../servicios/auth.service";
import { Router } from "@angular/router";
import { Component, NgZone, OnInit } from "@angular/core";

import * as $ from "jquery";
//import * as postscribe from 'postscribe'
import postscribe from 'postscribe';

//declare var $: any;

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.page.html",
  styleUrls: ["./inicio.page.scss"]
})

export class InicioPage implements OnInit {
  reload = true;
  chat;
  bemteTransaccionId;
  clase_id = 1;
  tarea_id = 0
  combo = 0
  total = 10
  user;
  constructor(
    public util: UtilService,
    private fcm: FcmService,
    private router: Router,
    public auth: AuthService,
    private db: DbService,
    private _ngZone: NgZone
  ) { 
    window['angularComponentRef'] = {component: this, zone: _ngZone};
  }

  async ngOnInit() {
    if (this.util.isMobile()) {
      try {
        const user = await this.auth.getUserData();
        if (user) {
          if (!user.token || user.token != (await this.fcm.getToken()))
            this.fcm.actualizarToken();

        }
      } catch (error) { }
    }
    window['my'] = window['my'] || {};
    window['my'].namespace = window['my'].namespace || {};
    window['my'].namespace.iniciarTransaccion = this.iniciarTransaccion.bind(this);
    window['my'].namespace.finTransaccion = this.finTransaccion.bind(this);
    window['my'].namespace.total = this.total;
    this.user = await this.auth.getUserData();
    window['my'].namespace.user = this.user;

  }

  ionViewWillLeave() {
    window['angularComponent'] = null;
  }

  ionViewWillEnter() {
    this.reload = true;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.util.getStorage('chat').then(chat => {
        console.log('chat en el getStorage inicio', chat);
        if (chat) {
          this.db.newChat$.next(JSON.parse(chat));
          this.router.navigateByUrl('chat/1/1');
        }
      }).catch(_ => { })
      // window['angularComponentRef'].zone.run(()=>{
      //   this.pay();
      // })
    }, 500);
  }

  ionViewDidLeave() {
    this.reload = false;
  }

  goTo(url) {
    this.router.navigateByUrl(url);
  }

  async actualizar(event) {
    this.reload = false;
    setTimeout(() => {
      this.reload = true;
      event.target.complete();
    }, 600);

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
        const resp = await this.db.post("finTransaccion", data);
        //this.bemteTransaccionId = resp.transaccion_id;
        this.util.showMessage('Transacción exitosa');
        document.getElementById('response').innerHTML = `<h3>Transacción exitosa Bemte id: ${this.bemteTransaccionId}, Pago id transaccion: ${response.transaction.id}</h3>`;

      } catch (e) {
        document.getElementById('response').innerHTML = `<h3>Error en Bemte transaccion id: ${this.bemteTransaccionId}, Pago id transaccion: ${response.transaction.id}, REPORTAR!!</h3>`;
        this.util.showMessage(`Hemos tenido un problema, Bemte transaccion ${this.bemteTransaccionId}`);
      }
    }

  }

  pay(){
     // `prod`, `stg`, `local` to change environment. Default is `stg`
      postscribe('#response', `<script>
      let paymentCheckout = new PaymentCheckout.modal({
        client_app_code: 'TPP3-EC-CLIENT', // Client Credentials
        client_app_key: 'ZfapAKOk4QFXheRNvndVib9XU3szzg', // Client Credentials
        locale: 'es', // User's preferred language (es, en, pt). English will be used by default.
        env_mode: 'stg',
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
    
      let btnOpenCheckout = document.querySelector('.js-payment-checkout');
      btnOpenCheckout.addEventListener('click', function () {
        window['angularComponentRef'].component.iniciarTransaccion().then((value) => {
          paymentCheckout.open({
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
        paymentCheckout.close();
      });
</script>`)
}

}
