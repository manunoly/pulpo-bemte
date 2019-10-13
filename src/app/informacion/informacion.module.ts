import { TerminosPageModule } from './../login/terminos/terminos.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InformacionPage } from './informacion.page';
import { SharedModule } from '../share/share.module';

const routes: Routes = [
  {
    path: '',
    component: InformacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TerminosPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InformacionPage]
})
export class InformacionPageModule {}
