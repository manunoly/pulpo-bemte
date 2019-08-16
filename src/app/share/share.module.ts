import { CalificarComponent } from './calificar/calificar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderBemteComponent } from './header-bemte/header-bemte.component';
import { HeaderUserComponent } from './header-user/header-user.component';


@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent],
  exports: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent],
  entryComponents: [CalificarComponent, HeaderBemteComponent, HeaderUserComponent]

})
export class SharedModule { } 