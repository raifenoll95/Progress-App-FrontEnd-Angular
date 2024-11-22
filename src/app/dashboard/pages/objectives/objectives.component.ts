import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../service/dashboard.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Objective } from '../../interfaces/objective.interface';
import { SharedDataService } from '../../service/shared-data-service.service';
import { ObjectiveService } from '../../service/objectives/objective.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.css'
})
export class ObjectivesComponent implements OnInit{

  private fb = inject(FormBuilder);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private objectiveService = inject(ObjectiveService);
  private router = inject(Router);
  objectives: Objective[] = [];
  showFormObjective: boolean = false; // Controla si el formulario está visible

  photoPreview: string | null = 'assets/profile.png'; // Imagen por defecto
  defaultPhoto: string = 'assets/profile.png'; // Imagen por defecto

  constructor(private sharedDataService: SharedDataService) {}

  // Formulario ObjectiveForm
  public objectiveForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    reps: [, [Validators.required]],
    weight: ['',]
  });

  setPhotoProfile() {
    //Foto de perfil arriba a la derecha
    const email = this.authService.currentUser()?.email;

    if (email) {
      this.dashboardService.getProfileByEmail(email).subscribe({
        next: (profile) => {
          if (profile && profile.photo) {
            this.photoPreview = profile.photo;
          } else {
            this.photoPreview = this.defaultPhoto;
          }
        },
        error: () => {
          console.error('Error al cargar el perfil');
          this.photoPreview = this.defaultPhoto;
        },
      });
    } else {
      this.photoPreview = this.defaultPhoto;
    }
  }

  getObjectives() {
    this.objectiveService.getObjectives().
      subscribe(
        (data: Objective[]) => {
          this.objectives = data;
        },
        (error) => {
          console.error('Error fetching objectives', error);
        }
      );
  }

  //OnInit componente
  ngOnInit(): void {

    //Actualiza foto de perfil
    this.setPhotoProfile();

    //Recuperar el listado de objetivos
    this.getObjectives();
  }

  toggleForm(): void {
    this.showFormObjective = !this.showFormObjective; // Alterna la visibilidad del formulario
  }

  //Submit Introducir objetivo
  onSubmitObjective() : void{

    if(this.objectiveForm.valid) {

      const { name, reps, weight } = this.objectiveForm.value;
      const userId = this.authService.currentUser()?._id;

      this.objectiveService.create(userId!, name, reps, weight).
      subscribe({
        next: () => {
          Swal.fire({
            title: 'Objetivo añadido',
            text: 'Tu objetivo se añadió correctamente.',
            icon: 'success',
          });
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al crear el objetivo.', 'error');
        },
      });
    }
  }
}
