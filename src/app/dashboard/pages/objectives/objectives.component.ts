import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  userName: string = ''; //Nombre del usuario

  constructor(private sharedDataService: SharedDataService, private cdr: ChangeDetectorRef) {}

  // Formulario ObjectiveForm
  public objectiveForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    reps: [, [Validators.required]],
    weight: ['',]
  });

  //Setear foto de perfil y nombre de usuario
  setPhotoProfileAndUser() {
    //Foto de perfil arriba a la derecha
    const email = this.authService.currentUser()?.email;

    if (email) {
      this.dashboardService.getProfileByEmail(email).subscribe({
        next: (profile) => {
          if(profile) {
            this.userName = profile.name;
            if(profile.photo){
              this.photoPreview = profile.photo;
            }
            else {
              this.photoPreview = this.defaultPhoto;
            }
            //this.cdr.detectChanges(); // <-- Forzar detección de cambios
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

  //Obten los objetivos de un usuario
  getObjectives() {
    const id = this.authService.currentUser()?._id;
    this.objectiveService.getObjectives(id!).
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

    const currentUser = this.authService.currentUser();
    this.authService.getUser(currentUser?._id!).subscribe({
      next: (user) => {
        if(!user.perfil) {
          this.router.navigateByUrl('/dashboard/perfil');
        }
      }
    })

    //Actualiza foto de perfil y nombre de usuario
    this.setPhotoProfileAndUser();
    //Recuperar el listado de objetivos
    this.getObjectives();
  }

  // Alterna la visibilidad del formulario
  toggleForm(): void {
    this.showFormObjective = !this.showFormObjective;
  }

  //Submit Introducir objetivo
  onSubmitObjective() : void {

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
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              htmlContainer: 'swal-text',
              confirmButton: 'swal-button'
            },
            buttonsStyling: false // Deshabilita estilos predeterminados de botones
          });

          // Una vez creado el objetivo, llamamos a getObjectives() para actualizar la lista
          const id = this.authService.currentUser()?._id;
          this.objectiveService.getObjectives(id!).subscribe({
            next: (updatedObjectives) => {
              // Actualizamos la lista de objetivos en el componente
              this.objectives = updatedObjectives;
            },
            error: (err) => {
              console.error('Error al obtener los objetivos actualizados:', err);
              Swal.fire('Error', 'No se pudo actualizar la lista de objetivos.', 'error');
            }
          });

          //Cierra formulario
          this.toggleForm();
          //Resetea formulario
          this.objectiveForm.reset();
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al crear el objetivo.', 'error');
        },
      });
    }
  }

  //Al hacer click en uno de las tarjetas se redirige a un formulario en -> components
  onCardClick(objective: Objective) {
    this.router.navigate(['/dashboard/objectivesForm', objective._id]);
  }
}
