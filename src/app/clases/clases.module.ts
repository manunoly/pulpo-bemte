import { SharedModule } from './../share/share.module';
import { MapPageModule } from './../map/map.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClasesPage } from './clases.page';
import { IonicSelectableModule } from 'ionic-selectable';

const routes: Routes = [
  {
    path: '',
    component: ClasesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MapPageModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClasesPage]
})
export class ClasesPageModule {}
