import { ClaseAplicadaProfesorPageModule } from './../clase-aplicada-profesor/clase-aplicada-profesor.module';
import { ChatPageModule } from './../chat/chat.module';
import { SharedModule } from 'src/app/share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TareaDetallesPage } from './tarea-detalles.page';

const routes: Routes = [
  {
    path: ':id',
    component: TareaDetallesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ClaseAplicadaProfesorPageModule,
    ChatPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TareaDetallesPage]
})
export class TareaDetallesPageModule {}
