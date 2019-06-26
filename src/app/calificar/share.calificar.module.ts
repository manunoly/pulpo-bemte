import { CalificarComponent } from './calificar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [CalificarComponent],
  exports: [CalificarComponent],
  entryComponents: [CalificarComponent]

})
export class SharedCalificarModule {} 