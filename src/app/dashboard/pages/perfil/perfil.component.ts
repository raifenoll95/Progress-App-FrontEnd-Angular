import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../service/dashboard.service';
import Swal from 'sweetalert2';
import { SharedDataService } from '../../service/shared-data-service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isEditing: boolean = false; // Indica si estamos en modo edición
  profileId: string | null = null; // ID del perfil si estamos editando

  public athleteForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    age: [, [Validators.required, Validators.min(10)]],
    gender: ['', Validators.required],
    height: [, [Validators.required, Validators.min(100)]],
    weight: [, [Validators.required, Validators.min(30)]],
    photo: [null], // Campo para la foto
    email: ['', [Validators.required, Validators.email]],
    specialty: ['', Validators.required],
  });

  photoPreview: string | null = 'assets/profile.png'; // Imagen por defecto
  defaultPhoto: string = 'assets/profile.png'; // Imagen por defecto

  @ViewChild('fileInput') public fileInput?: ElementRef;

  constructor(private cdr: ChangeDetectorRef, private sharedDataService: SharedDataService) {};

  triggerFileInput() {
    this.fileInput!.nativeElement.click();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verifica que el archivo sea válido
      if (file instanceof File) {
        console.log("Archivo seleccionado:", file);

        // Crear un objeto Image para cargar la imagen
        const img = new Image();
        const reader = new FileReader();

        // Una vez que se haya cargado la imagen en el FileReader, procesarla
        reader.onload = (e: any) => {
        img.onload = () => {
        // Crear un canvas para redimensionar la imagen
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Establece las dimensiones del canvas
        const MAX_WIDTH = 800;  // Ancho máximo
        const MAX_HEIGHT = 800; // Alto máximo
        let width = img.width;
        let height = img.height;

        // Mantener la relación de aspecto de la imagen
        if (width > height) {
          if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
              if (height > MAX_HEIGHT) {
                width = (width * MAX_HEIGHT) / height;
                height = MAX_HEIGHT;
              }
            }

            // Redimensionar la imagen
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            // Comprimir la imagen y convertirla en un Blob (puedes cambiar el tipo MIME a 'image/png' si prefieres PNG)
            canvas.toBlob((blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, { type: file.type });

                // Mostrar vista previa de la imagen comprimida
                const previewUrl = URL.createObjectURL(compressedFile);
                this.photoPreview = previewUrl;

                // Forzar la actualización de la vista
                this.cdr.detectChanges();  // Esto asegura que Angular detecte los cambios y actualice la vista

                // Guardar el archivo comprimido en el formulario
                this.athleteForm.patchValue({
                  photo: compressedFile
                });

                console.log("Archivo comprimido:", compressedFile);
              }
            }, 'image/jpeg', 0.7); // El 0.7 indica calidad de compresión (0 es lo más comprimido, 1 es sin pérdida)
          };

          img.src = e.target.result; // Cargar la imagen en el objeto Image
        };

        reader.readAsDataURL(file); // Leer la imagen seleccionada
      } else {
        console.error("El archivo no es un tipo File válido.");
      }
    } else {
      console.error("No se ha seleccionado ningún archivo.");
    }
  }

  ngOnInit(): void {

    //Primero de todo seteamos el correo del usuario
    const email = this.authService.currentUser()?.email;
    this.athleteForm.patchValue({
      email: email
    });

    //En caso de que ya se haya guardado el perfil, procedo a recuperarlo de bd
    if (email) {
      this.dashboardService.getProfileByEmail(email).subscribe({
        next: (profile) => {
          if (profile) {
            this.isEditing = true; // Modo edicion
            this.profileId = profile._id; //Guardamos id perfil
            this.athleteForm.patchValue(profile); // Rellena el formulario

            // Procesar la foto en base64
            if (profile.photo) {
              this.photoPreview = `${profile.photo}`;
            } else {
              this.photoPreview = this.defaultPhoto; // Imagen por defecto
            }

            // Actualizar la foto en el servicio compartido
            this.sharedDataService.setProfilePhoto(this.photoPreview);
          }
        }
      });
    }
  }

  //Guardar/Update perfil
  private saveProfile(name: string, age: number, gender: string, height: number, weight: number, email: string, specialty: string, photo: string): void {
    if (this.isEditing && this.profileId) {
      // Actualizar perfil
      this.dashboardService.updateProfile(
        this.profileId, name, age, gender, height, weight, email, specialty, photo
      ).subscribe({
        next: () => {
          Swal.fire({
            title: 'Perfil Actualizado',
            text: 'Tu perfil se actualizó correctamente.',
            icon: 'success',
          });
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al actualizar el perfil.', 'error');
        },
      });
    } else {
      // Crear perfil
      this.dashboardService.createProfile(
        name, age, gender, height, weight, email, specialty, photo
      ).subscribe({
        next: () => {
          Swal.fire({
            title: 'Perfil Guardado',
            text: 'Tu perfil se guardó correctamente.',
            icon: 'success',
          });
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al guardar el perfil.', 'error');
        },
      });
    }
  }

  //OnSubmit
  onSubmit(): void {
    if (this.athleteForm.valid) {
      const { name, age, gender, height, weight, email, specialty, photo } = this.athleteForm.value;

      // Si la foto es base64, úsala directamente
      if (typeof photo === 'string') {
        this.saveProfile(name, age, gender, height, weight, email, specialty, photo);
        return;
      }

      // Si la foto es un archivo, conviértela a base64
      if (photo instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const photoBase64 = reader.result as string;
          this.saveProfile(name, age, gender, height, weight, email, specialty, photoBase64);
        };
        reader.readAsDataURL(photo);
      } else {
        console.error('La propiedad "photo" no contiene un archivo válido.');
      }
    } else {
      console.error('Formulario inválido.');
    }
  }
}
