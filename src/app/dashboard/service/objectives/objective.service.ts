import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Objective } from '../../interfaces/objective.interface';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {

  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router) { }

  // Método para crear perfil de usuario
  create(idUser: string, name: string, reps: number, weight: number): Observable<boolean> {

    const url  = `${ this.baseUrl }/objective/create`;
    const body = { idUser, name, reps, weight};

    //En post va el tipo de respuesta que devuelve
    return this.http.post<{objective: Objective}>(url, body).pipe(
      map(({ objective }) => {
        return true;
      }),
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'No se ha podido guardar correctamente el objetivo'));
      })
    );
  }

  // Método para obtener todos los objetivos de un usuario
  getObjectives(id: string): Observable<Objective[]> {

    const url  = `${ this.baseUrl }/objective/allObjectivesByUser`;

    return this.http.get<Objective[]>(url).pipe(
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'No se ha podido obtener el perfil'));
      })
    );
  }
}
