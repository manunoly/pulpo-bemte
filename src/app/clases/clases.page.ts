import { ModalController } from "@ionic/angular";
import { Location } from "@angular/common";
import { UtilService } from "./../servicios/util.service";
import { DbService } from "./../servicios/db.service";
import { AuthService } from "./../servicios/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapPage } from "./../map/map.page";

@Component({
  selector: "app-clases",
  templateUrl: "./clases.page.html",
  styleUrls: ["./clases.page.scss"]
})
export class ClasesPage implements OnInit {
  claseForm: FormGroup;
  materias;
  user;
  sedes;
  combos;
  horasCombo;
  comprar;
  comboToBuy;
  fechaMaxima;
  fechaMinima;
  hoy;
  map;
  minHora = "0";
  horasDisponibles;
  ultimoProfesor = false;
  customPickerOptions;

  constructor(
    private modalController: ModalController,
    private navigation: Location,
    public auth: AuthService,
    private db: DbService,
    private router: Router,
    private fb: FormBuilder,
    public util: UtilService,
    private geolocation: Geolocation
  ) {
    this.customPickerOptions = {
      columns: [{
        name: 'framework',
        options: [
          { text: 'Angular', value: 'A' },
          { text: 'Vue', value: 'B' },
          { text: 'React', value: 'C' }
        ]
      }]
    }

    this.loadMinHora();
    let x = 12; //or whatever offset
    let currentDate = new Date();
    this.hoy = currentDate;
    this.hoy.setHours(1);
    this.hoy = this.hoy.toISOString();
    this.fechaMinima = currentDate.toISOString();
    if (currentDate.getDate() + 7 > 31) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    this.fechaMaxima = currentDate.toISOString();
    this.buildForm();

  }

  async ngOnInit() {

    this.util.showLoading();

    this.user = await this.auth.getUserData();

    setTimeout(() => {
      this.util.dismissLoading();
      this.geolocation.getCurrentPosition().then(_=>{}).catch(_=>{});
    }, 1300);

    if (this.user) {
      try {
        this.materias = await this.db.get("lista-materias");
        // this.horasDisponibles = await this.db.get('horas-totales?user_id=' + this.user.user_id);
        this.claseForm.controls["user_id"].setValue(this.user.user_id);
      } catch (error) {
        this.router.navigateByUrl("inicio");
      }
    } else this.router.navigateByUrl("inicio");
  }

  personasClase(est){
    if (est > 2)
      this.util.showMessage('De dos alumno en adelante, se te descontará 1 hora extra por cada alumno adicional.')
  }
  
  buildForm() {
    this.claseForm = this.fb.group({
      user_id: [this.user ? this.user.user_id : "", Validators.required],
      materia: ["", Validators.required],
      tema: ["", Validators.required],
      descripcion: ["", [Validators.required, Validators.maxLength(250)]],
      personas: [
        "1",
        [Validators.required]
      ],
      // 'ejercicios': [''],
      fecha: ["", Validators.required],
      hora1: ["", Validators.required],
      duracion: [
        "2",
        [Validators.required]
      ],
      hora: [""],
      selProfesor: ["false"],
      ubicacion: ["", Validators.required],
      coordenadas: [""],
      seleccion_profesor: ["false"]
    });
  }

  async confirmarClase() {
    // hora_fin: "13:00"hora1: "2019-06-07T11:10:08.543-05:00"
    // hora_inicio: "12:00"

    /**
    TODO: aumentar horas solicitadas por la cantidad de alumnos.
    if(this.claseForm.value.alumnos > 1)
     */
    // if (this.claseForm.value.duracion > horas) {
    //   this.util.showMessage(
    //     "Las horas solicitadas para la clase es mayor a la cantidad disponible "
    //   );
    //   return;
    // }

    let dataPost = this.claseForm.value;
    dataPost["fecha"] = this.claseForm.value.fecha.slice(0, 10);
    dataPost["hora1"] = this.claseForm.value.hora1.slice(11, 16);
    dataPost["materia"] = this.claseForm.value.materia.nombre;
    this.util.showLoading();
    try {
      const resp = await this.db.post("solicitar-clase", dataPost);
      this.util.dismissLoading();
      if (resp && resp.success) {
        this.util.showMessage(resp.success);
        this.buildForm();
        if (resp.clase && resp.clase.estado) {
          this.router.navigateByUrl('clase-detalles/' + resp.clase.id);
          // this.router.navigate(['clase-detalles'], {queryParams: {idUser: event.value}});

        }
      }
    } catch (error) {
      this.util.dismissLoading();
      console.log("error", error);
    }
  }

  atras() {
    this.navigation.back();
  }

  async validarHora(fechaD) {
    let fecha = new Date(fechaD);
    let hoy = new Date(this.hoy);


    let diff = fecha.getTime() - hoy.getTime();
    if (diff / (1000 * 60 * 60 * 24) > 8) {
      this.util.showMessage("Solicite su clase con 7 días máximo de antelación");
      this.claseForm.controls["hora1"].setValue("");
      this.claseForm.controls["fecha"].setValue("");
      return;
    }

    if (hoy.getMonth() == fecha.getMonth() && hoy.getDate() > fecha.getDate()) {
      this.claseForm.controls["hora1"].setValue("");
      this.claseForm.controls["fecha"].setValue("");
      this.util.showMessage("Revise las fechas por favor");
      return;
    }
    if (
      hoy.getMonth() == fecha.getMonth() &&
      hoy.getDate() == fecha.getDate()
    ) {
      console.log("la fecha es hoy");
      this.loadMinHora(fecha.getHours() + 2);
      this.claseForm.controls["hora1"].setValue("");
    } else this.loadMinHora();
  }

  async loadMinHora(min = 0) {
    this.minHora = min + "";
    min = min + 1;
    while (min < 24) {
      this.minHora = this.minHora + "," + min;
      min = min + 1;
    }
    console.log(this.minHora);
  }

  async goToMap() {
    const modal = await this.modalController.create({
      component: MapPage
      // componentProps: { ubicacion: { lat: -0.1740159, lng: -78.463816299 } }
    });
    modal.onDidDismiss().then(data => {
      if (data && data.data && data.data.ubicacion) {
        console.log(data);
        this.claseForm.controls["ubicacion"].setValue(data.data.ubicacion);
        this.claseForm.controls["coordenadas"].setValue(
          JSON.stringify(data.data.coordenadas)
        );
      }
    });
    return await modal.present();
  }

  async claseAnteriorProfesor(materia?) {
    // this.claseForm.controls["materia"].setValue(materia);
    console.log(materia);
    if (materia)
      this.ultimoProfesor = await this.db.get('seleccionar-profesor?user_id=' + this.user.user_id + '&materia_id=' + materia)
  }
}
