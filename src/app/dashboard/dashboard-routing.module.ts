import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ObjectivesComponent } from './pages/objectives/objectives.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {path: 'perfil', component: PerfilComponent},
      {path: 'exercises', component: ExercisesComponent},
      {path: 'objectives', component: ObjectivesComponent},
      {path: '**', redirectTo: 'perfil'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
