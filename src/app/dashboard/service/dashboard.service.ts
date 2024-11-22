import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Profile } from '../interfaces/profile.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router) { }

  // Método para crear perfil de usuario
  createProfile(name: String, age: number, gender: string, height: number, weight: number, email: string, specialty: string, photo: string): Observable<boolean> {

    const url  = `${ this.baseUrl }/profile/create`;
    const body = { name, age, gender, height, weight, email, specialty, photo};

    //En post va el tipo de respuesta que devuelve
    return this.http.post<{profile: Profile}>(url, body).pipe(
      map(({ profile }) => {
        return true; // Indicar éxito en la autenticación
      }),
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'No se ha podido guardar correctamente el perfil'));
      })
    );
  }

  // Método para obtener el perfil por email
  getProfileByEmail(email: string): Observable<Profile> {
    const url = `${this.baseUrl}/profile/email/${email}`;
    return this.http.get<Profile>(url).pipe(
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'No se ha podido obtener el perfil'));
      })
    );
  }

  // Método para actualizar el perfil
  updateProfile(id: string, name: string, age: number, gender: string, height: number, weight: number, email: string, specialty: string, photo: string): Observable<boolean> {

    const url = `${this.baseUrl}/update/${id}`;
    const body = { name, age, gender, height, weight, email, specialty, photo };

    return this.http.put<{ profile: Profile }>(url, body).pipe(
      map(({ profile }) => true),
      catchError(err => throwError(() => new Error(err.error?.message || 'No se ha podido actualizar el perfil')))
    );
  }
}
