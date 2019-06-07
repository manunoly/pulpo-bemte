import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SolicitarSerProfesorPage } from './solicitar-ser-profesor.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarSerProfesorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SolicitarSerProfesorPage]
})
export class SolicitarSerProfesorPageModule {}
