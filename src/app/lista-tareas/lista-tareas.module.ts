import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaTareasPage } from './lista-tareas.page';
import { SharedCalificarModule } from '../calificar/share.calificar.module';

const routes: Routes = [
  {
    path: '',
    component: ListaTareasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedCalificarModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaTareasPage]
})
export class ListaTareasPageModule {}
