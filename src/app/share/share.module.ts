import { FormsModule } from '@angular/forms';
import { HorasSeleccionarComponent } from './horas-seleccionar/horas-seleccionar.component';
import { CalificarComponent } from './calificar/calificar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderBemteComponent } from './header-bemte/header-bemte.component';
import { HeaderUserComponent } from './header-user/header-user.component';
import { SubirTransferenciaComponent } from './subir-transferencia/subir-transferencia.component';


@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent, HorasSeleccionarComponent, SubirTransferenciaComponent],
  exports: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent, HorasSeleccionarComponent, SubirTransferenciaComponent],
  entryComponents: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent, HorasSeleccionarComponent, SubirTransferenciaComponent]

})
export class SharedModule { } 