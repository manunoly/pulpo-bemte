import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BilleteraEstudiantePage } from './billetera-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: BilleteraEstudiantePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BilleteraEstudiantePage]
})
export class BilleteraEstudiantePageModule {}
