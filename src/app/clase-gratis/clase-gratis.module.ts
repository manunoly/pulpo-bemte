import { SharedModule } from './../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClaseGratisPage } from './clase-gratis.page';

const routes: Routes = [
  {
    path: '',
    component: ClaseGratisPage
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
  declarations: [ClaseGratisPage]
})
export class ClaseGratisPageModule {}
