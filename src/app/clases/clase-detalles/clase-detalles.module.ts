import { ClaseAplicadaProfesorPageModule } from './../../clase-aplicada-profesor/clase-aplicada-profesor.module';
import { ChatPageModule } from './../../chat/chat.module';
import { MapPageModule } from './../../map/map.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClaseDetallesPage } from './clase-detalles.page';
import { SharedModule } from 'src/app/share/share.module';

const routes: Routes = [
  {
    path: ':id',
    component: ClaseDetallesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MapPageModule,
    ClaseAplicadaProfesorPageModule,
    ChatPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClaseDetallesPage]
})
export class ClaseDetallesPageModule {}
