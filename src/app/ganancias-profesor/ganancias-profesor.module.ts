import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GananciasProfesorPage } from './ganancias-profesor.page';
import { SharedModule } from '../share/share.module';

const routes: Routes = [
  {
    path: '',
    component: GananciasProfesorPage
  },
  {
    path: ':tipo',
    component: GananciasProfesorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GananciasProfesorPage]
})
export class GananciasProfesorPageModule {}
