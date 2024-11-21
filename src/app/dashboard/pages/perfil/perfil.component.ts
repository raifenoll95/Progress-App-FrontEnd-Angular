import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  //Formulario perfil
  public athleteForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
      age: [, [Validators.required, Validators.min(10)]],
      gender: ['', Validators.required],
      height: [, [Validators.required, Validators.min(100)]],
      weight: [, [Validators.required, Validators.min(30)]],
      photo: [null], // No se necesita un valor inicial
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required],
  });

  photoPreview: string | null = null; // Vista previa de la foto
  defaultPhoto: string = 'ruta/a/imagen/default.jpg'; // Ruta de imagen por defecto

  @ViewChild('fileInput')
  public fileInput?: ElementRef;

  triggerFileInput() {
    this.fileInput!.nativeElement.click();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.athleteForm.valid) {
      const updatedAthlete = this.athleteForm.value;
      console.log('Perfil Actualizado:', updatedAthlete);

      // Aquí podrías manejar la foto como un archivo o su Data URL
      console.log('Foto de perfil (vista previa):', this.photoPreview);
    } else {
      console.error('El formulario es inválido.');
    }
  }
}
