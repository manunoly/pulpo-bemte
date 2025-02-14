import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TareasListadoPage } from './tareas-listado.page';
import { SharedModule } from '../share/share.module';
import { ClaseAplicadaProfesorPageModule } from '../clase-aplicada-profesor/clase-aplicada-profesor.module';

const routes: Routes = [
  {
    path: '',
    component: TareasListadoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ClaseAplicadaProfesorPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TareasListadoPage]
})
export class TareasListadoPageModule {}
