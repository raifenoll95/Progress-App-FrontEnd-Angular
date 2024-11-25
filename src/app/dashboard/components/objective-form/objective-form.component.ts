import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObjectiveService } from '../../service/objectives/objective.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Objective } from '../../interfaces/objective.interface';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrl: './objective-form.component.css'
})
export class ObjectiveFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(ActivatedRoute);
  private objectiveService = inject(ObjectiveService);

  constructor() {}

  public objectiveForm?: Objective;

  //leer objetivo
  loadObjective(id: string): void {
    this.objectiveService.getObjectiveById(id).subscribe((objective) => {
      this.objectiveForm = objective; // Carga datos en el formulario
    });
  }

  ngOnInit(): void {

    // Obtener el ID de la ruta usando snapshot
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.loadObjective(id); // Cargar el objetivo si el ID existe
    }
    // else {
    //   this.initializeNewObjective(); // Si no hay ID, inicializa un nuevo objetivo
    // }
  }
}
