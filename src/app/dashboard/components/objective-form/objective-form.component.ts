import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectiveService } from '../../service/objectives/objective.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Objective } from '../../interfaces/objective.interface';
import { DashboardService } from '../../service/dashboard.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-objective-form',
  templateUrl: './objective-form.component.html',
  styleUrl: './objective-form.component.css'
})
export class ObjectiveFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(ActivatedRoute);
  private router2 = inject(Router);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private objectiveService = inject(ObjectiveService);
  photoPreview: string | null = 'assets/profile.png'; // Imagen por defecto
  defaultPhoto: string = 'assets/profile.png'; // Imagen por defecto
  userName: string = ''; //Nombre del usuario

  constructor() {}

  public objectiveForm?: Objective;

  //leer objetivo
  loadObjective(id: string): void {
    this.objectiveService.getObjectiveById(id).subscribe((objective) => {
      this.objectiveForm = objective; // Carga datos en el formulario
    });
  }

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

  ngOnInit(): void {

    // Obtener el ID de la ruta usando snapshot
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.loadObjective(id); // Cargar el objetivo si el ID existe
    }

    //Actualiza foto de perfil y nombre de usuario
    this.setPhotoProfileAndUser();
  }

  //regresar al listado de objetivos
  goBack() {
    this.router2.navigate(['/dashboard/objectives']);  // Asegúrate de que esta ruta sea correcta
  }
}
