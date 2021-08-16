import { DbService } from './../../servicios/db.service';
import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UploadService } from 'src/app/servicios/upload.service';
import { UtilService } from 'src/app/servicios/util.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-subir-transferencia',
  templateUrl: './subir-transferencia.component.html',
  styleUrls: ['./subir-transferencia.component.scss'],
})
export class SubirTransferenciaComponent implements OnInit {
  segmentModel = 'transferencia';
  img;
  bemteTransaccionId;
  @Input() clase_id = 0;
  @Input() tarea_id = 0
  @Input() combo = 0
  @Input() total = 0
  @Output('accion')
  change: EventEmitter<boolean> = new EventEmitter<boolean>();
  
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

  constructor(public upload: UploadService, public util: UtilService, public auth: AuthService, public db: DbService) { }

  ngOnInit() { }
  ionViewWillEnter() {
    this.img = '';
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

  public async iniciarTransaccion(){
    console.log('iniciar transaccion');
    const user = await this.auth.getUserData();
    if (!user) {
      return this.util.showMessage('NO realizar pago, No hemos podido obtener los datos del usuario');
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
      data['horas'] = this.combo['hora'];
    }
    try {
      const resp = await this.db.post("inicioTransaccion",data);
      //this.bemteTransaccionId = resp.transaccion_id;
      this.bemteTransaccionId = 1;
    } catch (e) {
      this.util.showMessage('Hemos tenido un problema, NO realizar pago');
    }
  }

  public async finTransaccion(response){
    console.log('fin transaccion');
    const user = await this.auth.getUserData();
    if (!user) {
      return this.util.showMessage(`Hemos tenido un problema, Bemte transaccion ${this.bemteTransaccionId}`);
    }
    //respuesta de error
    response = {
      "transaction":{
          "status": "success", 
          "id": "CB-81011", 
          "status_detail": 3
      }
    };
    //respuesta de error
    response = {
      "error": {
        "type": "Server Error",
        "help": "Try Again Later",
        "description": "Sorry, there was a problem loading Checkout."
      }
    }
    if(response && response.error){
      return this.util.showMessage(`Hemos tenido un problema procesando el pago, ${response.description}, Bemte transaccion ${this.bemteTransaccionId}`);
    }

    if(response && response.status == "success"){
      let data = {
        bemteTransaccionId: this.bemteTransaccionId,
        user_id: user.user_id,
        tarea_id: this.tarea_id,
        clase_id: this.clase_id,
        combo_id: '0',
        total: this.total,
        description: 'pago bemte',
        number_card: "1234",
        status: response.status,  //datos de respuesta paymentez
        id: response.id, 
        status_detail: response.status_detail
      }
      if (this.tarea_id == 0 && this.clase_id == 0) {
        data['combo_id'] = 'COMBO';
        data['total'] = this.combo['descuento'];
      }
      try {
        const resp = await this.db.post("finTransaccion", data);
        //this.bemteTransaccionId = resp.transaccion_id;
        this.bemteTransaccionId = 1;
      } catch (e) {
        this.util.showMessage(`Hemos tenido un problema, Bemte transaccion ${this.bemteTransaccionId}`);
      }
    }

  }


  onResetClick() {
    this.cardForm.reset();
  }
  pagarCredito(){
    console.log(this.cardForm.value);
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
}
