import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'registrar', loadChildren: './login/registrar/registrar.module#RegistrarPageModule' },
  { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilPageModule' },
  { path: 'materias', loadChildren: './materias/materias.module#MateriasPageModule' },
  { path: 'tareas', loadChildren: './tareas/tareas.module#TareasPageModule' },
  { path: 'clases', loadChildren: './clases/clases.module#ClasesPageModule' },
  { path: 'combos', loadChildren: './combos/combos.module#CombosPageModule' },
  { path: 'combo-detalle', loadChildren: './combos/combo-detalle/combo-detalle.module#ComboDetallePageModule' },
  { path: 'inicio', loadChildren: './inicio/inicio.module#InicioPageModule' },
  { path: 'proyectos', loadChildren: './proyectos/proyectos.module#ProyectosPageModule' },
  { path: 'combo-hora', loadChildren: './combos/combo-hora/combo-hora.module#ComboHoraPageModule' },
  { path: 'tarea-estado', loadChildren: './tareas/estado/estado.module#EstadoPageModule' },
  { path: 'tareas-listado', loadChildren: './tareas-listado/tareas-listado.module#TareasListadoPageModule' },
  { path: 'tareas-pagar', loadChildren: './tareas/tareas-pagar/tareas-pagar.module#TareasPagarPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
