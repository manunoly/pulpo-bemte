import { HeaderBemteProfComponent } from './header-bemte-prof/header-bemte-prof.component';
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
  declarations: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent, HorasSeleccionarComponent, SubirTransferenciaComponent, HeaderBemteProfComponent],
  exports: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent, HorasSeleccionarComponent, SubirTransferenciaComponent, HeaderBemteProfComponent],
  entryComponents: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent, HorasSeleccionarComponent, SubirTransferenciaComponent, HeaderBemteProfComponent]

})
export class SharedModule { } 