import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectiveService } from '../../service/objectives/objective.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Objective } from '../../interfaces/objective.interface';
import { DashboardService } from '../../service/dashboard.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MarksService } from '../../service/marks/marks.service';
import Swal from 'sweetalert2';
import { Mark } from '../../interfaces/mark.interface';

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
  private marksService = inject(MarksService);
  private idObjective?: string;
  private idUser?: string;
  public marks: Mark[] = [];
  photoPreview: string | null = 'assets/profile.png'; // Imagen por defecto
  defaultPhoto: string = 'assets/profile.png'; // Imagen por defecto
  userName: string = ''; //Nombre del usuario

  constructor() {}

  public objectiveForm?: Objective;
  showForm: boolean = false;

  // Formulario ObjectiveForm
  public marksForm: FormGroup = this.fb.group({
    reps: [, [Validators.required]],
    weight: [''],
    sensations: [''],
  });

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

  getMarks() {
    // Una vez creado el objetivo, llamamos a getMarks() para actualizar la lista
    this.marksService.getMarks(this.idUser!, this.idObjective!).subscribe({
      next: (updatedMarks) => {
        // Actualizamos la lista de marcas
        this.marks = updatedMarks;
        console.log(this.marks)
      },
      error: (err) => {
        console.error('Error al obtener los objetivos actualizados:', err);
        Swal.fire('Error', 'No se pudo actualizar la lista de objetivos.', 'error');
      }
    });
  }

  ngOnInit(): void {

    //Primero de todo seteamos el id del usuario en el formulario
    this.idUser = this.authService.currentUser()?._id!;

    // Obtener el ID de la ruta usando snapshot
    this.idObjective = this.router.snapshot.paramMap.get('id')!;
    if (this.idObjective) {
      this.loadObjective(this.idObjective); // Cargar el objetivo si el ID existe
    }

    //Obten todas las marcas de este objetivo
    this.getMarks();

    //Actualiza foto de perfil y nombre de usuario
    this.setPhotoProfileAndUser();
  }

  //regresar al listado de objetivos
  goBack() {
    this.router2.navigate(['/dashboard/objectives']);  // Asegúrate de que esta ruta sea correcta
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onSubmit() {
    if (this.marksForm.valid) {
      const { reps, weight, sensations } = this.marksForm.value;
      const date = new Date();

      // Crear perfil
      this.marksService.create(
        this.idUser!, this.idObjective!, reps, weight, date, sensations
      ).subscribe({
        next: () => {

          //Actualiza la tabla de marcas
          this.getMarks();

          Swal.fire({
            title: 'Marca registrada',
            text: 'Tu marca se guardó correctamente.',
            icon: 'success',
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              htmlContainer: 'swal-text',
              confirmButton: 'swal-button'
            },
            buttonsStyling: false // Deshabilita estilos predeterminados de botones
          });
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al guardar el perfil.', 'error');
        },
      });
      this.showForm = false; // Cierra el formulario
      //Resetea formulario
      this.marksForm.reset(); //Resetea el formulario
    }
  }
}
