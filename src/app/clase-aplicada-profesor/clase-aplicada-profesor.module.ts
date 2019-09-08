import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClaseAplicadaProfesorPage } from './clase-aplicada-profesor.page';
import { SharedModule } from '../share/share.module';

const routes: Routes = [
  {
    path: ':id',
    component: ClaseAplicadaProfesorPage
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
  declarations: [ClaseAplicadaProfesorPage]
})
export class ClaseAplicadaProfesorPageModule {}
