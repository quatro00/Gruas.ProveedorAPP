import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authAdminGuard } from 'src/app/guard/auth-admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiciosDisponiblesComponent } from './servicios-disponibles/servicios-disponibles.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReportePagosComponent } from './reporte-pagos/reporte-pagos.component';
import { ReporteServiciosComponent } from './reporte-servicios/reporte-servicios.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
        title: 'Dashboard',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'servicios-disponibles',
    component: ServiciosDisponiblesComponent,
    data: {
        title: 'Servicios disponibles',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    data: {
        title: 'Perfil',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'reporte-pagos',
    component: ReportePagosComponent,
    data: {
        title: 'Reporte de pagos',
    },
    //canActivate: [authAdminGuard]
  },
  {
    path: 'reporte-servicios',
    component: ReporteServiciosComponent,
    data: {
        title: 'Reporte de pagos',
    },
    //canActivate: [authAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
