import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'list', loadChildren: './list/list.module#ListPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
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
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'clase-estado', loadChildren: './clases/clase-estado/clase-estado.module#ClaseEstadoPageModule' },
  { path: 'lista-tareas', loadChildren: './lista-tareas/lista-tareas.module#ListaTareasPageModule' },
  { path: 'lista-clases', loadChildren: './lista-clases/lista-clases.module#ListaClasesPageModule' },
  { path: 'solicitar-ser-profesor', loadChildren: './solicitar-ser-profesor/solicitar-ser-profesor.module#SolicitarSerProfesorPageModule' },
  { path: 'clases-pagar', loadChildren: './clases/clases-pagar/clases-pagar.module#ClasesPagarPageModule' },
  { path: 'transferencias', loadChildren: './transferencias/transferencias.module#TransferenciasPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'billetera-estudiante', loadChildren: './billetera-estudiante/billetera-estudiante.module#BilleteraEstudiantePageModule' },
  { path: 'clase-gratis', loadChildren: './clase-gratis/clase-gratis.module#ClaseGratisPageModule' },
  { path: 'ayuda', loadChildren: './ayuda/ayuda.module#AyudaPageModule' },
  { path: 'registrarse', loadChildren: './login/registrarse/registrarse.module#RegistrarsePageModule' },
  { path: 'registrarse-confirm', loadChildren: './login/registrarse-confirm/registrarse-confirm.module#RegistrarseConfirmPageModule' },
  { path: 'comprar-horas', loadChildren: './comprar-horas/comprar-horas.module#ComprarHorasPageModule' },
  { path: 'clase-detalles', loadChildren: './clases/clase-detalles/clase-detalles.module#ClaseDetallesPageModule' },
  { path: 'clase-detalles/:id', loadChildren: './clases/clase-detalles/clase-detalles.module#ClaseDetallesPageModule' },
  { path: 'tarea-detalles', loadChildren: './tarea-detalles/tarea-detalles.module#TareaDetallesPageModule' },
  { path: 'tarea-detalles/:id', loadChildren: './tarea-detalles/tarea-detalles.module#TareaDetallesPageModule' },
  { path: 'notificaciones', loadChildren: './notificaciones/notificaciones.module#NotificacionesPageModule' },
  { path: 'clases-listado', loadChildren: './clases-listado/clases-listado.module#ClasesListadoPageModule' },
  { path: 'ganancias-profesor', loadChildren: './ganancias-profesor/ganancias-profesor.module#GananciasProfesorPageModule' },
  { path: 'registrarse-profesor', loadChildren: './login/registrarse-profesor/registrarse-profesor.module#RegistrarseProfesorPageModule' },
  { path: 'clase-aplicada-profesor', loadChildren: './clase-aplicada-profesor/clase-aplicada-profesor.module#ClaseAplicadaProfesorPageModule' },
  { path: 'perfil-profesor', loadChildren: './perfil-profesor/perfil-profesor.module#PerfilProfesorPageModule' },
  { path: 'inicio-profesor', loadChildren: './inicio-profesor/inicio-profesor.module#InicioProfesorPageModule' },
  { path: 'olvidar-pass', loadChildren: './login/olvidar-pass/olvidar-pass.module#OlvidarPassPageModule' },
  { path: 'terminos', loadChildren: './login/terminos/terminos.module#TerminosPageModule' },
  { path: 'alumno-profesor-detalle', loadChildren: './alumno-profesor-detalle/alumno-profesor-detalle.module#AlumnoProfesorDetallePageModule' },
  { path: 'informacion', loadChildren: './informacion/informacion.module#InformacionPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
