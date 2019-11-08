import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfeEstadoCuentaPage } from './profe-estado-cuenta.page';

const routes: Routes = [
 {
    path: ':estado',
    component: ProfeEstadoCuentaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfeEstadoCuentaPage]
})
export class ProfeEstadoCuentaPageModule {}
