import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificacionesPage } from './notificaciones.page';
import { SharedModule } from '../share/share.module';

const routes: Routes = [
  {
    path: '',
    component: NotificacionesPage
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
  declarations: [NotificacionesPage]
})
export class NotificacionesPageModule {}
