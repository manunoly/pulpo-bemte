import { RegistrarseConfirmPageModule } from './../registrarse-confirm/registrarse-confirm.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrarsePage } from './registrarse.page';
import { TerminosPageModule } from '../terminos/terminos.module';

const routes: Routes = [
  {
    path: '',
    component: RegistrarsePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegistrarseConfirmPageModule,
    TerminosPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrarsePage]
})
export class RegistrarsePageModule {}
