import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../service/dashboard.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Objective } from '../../interfaces/objective.interface';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.css'
})
export class ObjectivesComponent implements OnInit{

  private fb = inject(FormBuilder);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);
  objectives: Objective[] = [];
  showFormObjective: boolean = false; // Controla si el formulario está visible

  constructor() {}

  // Formulario ObjectiveForm
  public objectiveForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    reps: [, [Validators.required]],
    weight: ['',]
  });

  ngOnInit(): void {
    // Ejemplo de objetivos iniciales
    this.objectives = [
      { id: 1, name: 'Curl Bíceps', reps: 10, weight: 20 },
      { id: 2, name: 'Sentadilla', reps: 5, weight: 100 },
      { id: 3, name: 'Press Banca', reps: 4, weight: 80 },
    ];
  }

  toggleForm(): void {
    this.showFormObjective = !this.showFormObjective; // Alterna la visibilidad del formulario
  }

  //Submit Introducir objetivo
  addObjective() {

    if (this.objectiveForm.valid) {
      const { name, reps, weight } = this.objectiveForm.value;

      const newObjective: Objective = {
        id: this.objectives.length + 1,
        name,
        reps,
        weight,
      };

      this.objectives.push(newObjective);

      // Limpiar el formulario y ocultarlo
      this.objectiveForm.reset();
      this.showFormObjective = false;
    }
  }

}
