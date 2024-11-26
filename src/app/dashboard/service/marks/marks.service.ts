import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Mark } from '../../interfaces/mark.interface';

@Injectable({
  providedIn: 'root'
})
export class MarksService {

  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router) { }

  // Método para crear una marca de un objetivo
  create(idUser: string, idObjective: string, reps: number, weight: number, date: Date, sensations: string): Observable<boolean> {

    const url  = `${ this.baseUrl }/marks/create`;
    const body = { idUser, idObjective, reps, weight, date, sensations};

    //En post va el tipo de respuesta que devuelve
    return this.http.post<{mark: Mark}>(url, body).pipe(
      map(({ mark }) => {
        return true;
      }),
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'No se ha podido guardar correctamente la marca del objetivo'));
      })
    );
  }

  // Método para obtener todos los marcas de ese objetivo para ese usuario
  getMarks(idUser: string, idObjective: string): Observable<Mark[]> {

    const url  = `${ this.baseUrl }/marks/allMarksByUser/${idUser}/${idObjective}`;

    return this.http.get<Mark[]>(url).pipe(
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'No se ha podido obtener las marcas de ese objetivo'));
      })
    );
  }
}
