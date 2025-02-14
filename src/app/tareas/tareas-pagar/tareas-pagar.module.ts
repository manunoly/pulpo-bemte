import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TareasPagarPage } from './tareas-pagar.page';

const routes: Routes = [
  {
    path: ':/tipo',
    component: TareasPagarPage
  },
  {
    path: ':/tipo:/data',
    component: TareasPagarPage
  },
  {
    path: '',
    component: TareasPagarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TareasPagarPage]
})
export class TareasPagarPageModule {}
