import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ObjectivesComponent } from './pages/objectives/objectives.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { ObjectiveFormComponent } from './components/objective-form/objective-form.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {path: 'perfil', component: PerfilComponent},
      {path: 'exercises', component: ExercisesComponent},
      {path: 'objectives', component: ObjectivesComponent},
      {path: 'objectivesForm/:id', component: ObjectiveFormComponent },
      {path: '**', redirectTo: 'objectives'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
