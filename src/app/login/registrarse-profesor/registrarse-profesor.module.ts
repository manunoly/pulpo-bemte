import { RegistrarseConfirmPageModule } from './../registrarse-confirm/registrarse-confirm.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrarseProfesorPage } from './registrarse-profesor.page';
import { TerminosPageModule } from '../terminos/terminos.module';

const routes: Routes = [
  {
    path: '',
    component: RegistrarseProfesorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegistrarseConfirmPageModule,
    TerminosPageModule,
    IonicSelectableModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrarseProfesorPage]
})
export class RegistrarseProfesorPageModule {}
