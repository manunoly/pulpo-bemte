import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrarseConfirmPage } from './registrarse-confirm.page';

const routes: Routes = [
  {
    path: ':id',
    component: RegistrarseConfirmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrarseConfirmPage]
})
export class RegistrarseConfirmPageModule {}
