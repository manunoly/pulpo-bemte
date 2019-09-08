import { ClaseAplicadaProfesorPageModule } from './../clase-aplicada-profesor/clase-aplicada-profesor.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClasesListadoPage } from './clases-listado.page';
import { SharedModule } from '../share/share.module';

const routes: Routes = [
  {
    path: '',
    component: ClasesListadoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaseAplicadaProfesorPageModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClasesListadoPage]
})
export class ClasesListadoPageModule {}
