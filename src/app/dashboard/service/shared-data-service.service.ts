import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private profilePhotoSubject = new BehaviorSubject<string>('assets/profile.png'); // Valor inicial

  // Observable para suscribirse a los cambios en la foto
  profilePhoto$ = this.profilePhotoSubject.asObservable();

  // Método para actualizar la foto
  setProfilePhoto(photo: string): void {
    this.profilePhotoSubject.next(photo);
  }
}
