import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClaseEstadoPage } from './clase-estado.page';

const routes: Routes = [
  {
    path: '',
    component: ClaseEstadoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClaseEstadoPage]
})
export class ClaseEstadoPageModule {}
