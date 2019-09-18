import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InicioProfesorPage } from './inicio-profesor.page';
import { SharedModule } from '../share/share.module';

const routes: Routes = [
  {
    path: '',
    component: InicioProfesorPage
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
  declarations: [InicioProfesorPage]
})
export class InicioProfesorPageModule {}
