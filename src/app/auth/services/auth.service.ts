import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStatus, User } from '../interfaces';
import { environment } from '../../../environments/environments';
import { ProfileCreated } from '../interfaces/create-profile-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;

  private _currentUser: User | null = null; // Estado local del usuario
  private _authStatus: AuthStatus = AuthStatus.checking; // Estado de autenticación
  private readonly storageUserKey = 'currentUser';
  private readonly storageTokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {
    this.restoreAuthState(); // Restaurar el estado de autenticación al iniciar la app
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<boolean> {

    const url  = `${ this.baseUrl }/auth/login`;
    const body = { email, password };

    return this.http.post<{ user: User; token: string }>(url, body).pipe(
      map(({ user, token }) => {
        this.setAuthentication(user, token); // Configuramos autenticación
        return true; // Indicar éxito en la autenticación
      }),
      catchError(err => {
        this._authStatus = AuthStatus.notAuthenticated; // Actualizar el estado
        return throwError(() => new Error(err.error?.message || 'Error desconocido'));
      })
    );
  }

  //register servicio
  register( email: string, password: string, perfil: boolean ): Observable<boolean> {

    const url  = `${ this.baseUrl }/auth/register`;
    const body = { email, password, perfil };

    return this.http.post<{ user: User; token: string }>( url, body )
      .pipe(
        map( ({ user, token }) => {
          this.setAuthentication( user, token );
          return true;
        }),
        catchError( err => throwError( () => err.error.message ))
      );
  }

  //Este metodo se llama cuando se crea un perfil de usuario.
  updateUserProfile(id: string, perfil: boolean): Observable<boolean> {
    const url = `${this.baseUrl}/auth/updateProfileValue/${id}`;
    const body = { perfil };

    return this.http.put<{ user: User }>(url, body).pipe(
      map(({ user }) => true),
      catchError(err => throwError(() => new Error(err.error?.message || 'No se ha podido actualizar el usuario')))
    );
  }

  //Obtiene el perfil del usuario
  getUser(id: string): Observable<User>{
    const url = `${this.baseUrl}/auth/getUser/${id}`;

    return this.http.get<User>(url).pipe(
      catchError(err => {
        return throwError(() => new Error(err.error?.message || 'No se ha podido obtener el perfil'));
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    this._currentUser = null;
    this._authStatus = AuthStatus.notAuthenticated;
    localStorage.removeItem(this.storageUserKey);
    localStorage.removeItem(this.storageTokenKey);
    this.router.navigate(['/auth/login']); // Redirigir al login
  }

  // Obtener el usuario actual
  currentUser(): User | null {
    return this._currentUser;
  }

  // Estado de autenticación
  authStatus(): AuthStatus {
    return this._authStatus;
  }

  // Restaurar el estado de autenticación desde el almacenamiento local
  private restoreAuthState(): void {
    const storedUser = localStorage.getItem(this.storageUserKey);
    const storedToken = localStorage.getItem(this.storageTokenKey);

    if (storedUser && storedToken) {
      this._currentUser = JSON.parse(storedUser);
      this._authStatus = AuthStatus.authenticated;
    } else {
      this._authStatus = AuthStatus.notAuthenticated;
    }
  }

  // Seteamos el usuario y el token al loguearse
  private setAuthentication(user: User, token: string): void {
    this._currentUser = user;
    this._authStatus = AuthStatus.authenticated;
    localStorage.setItem(this.storageUserKey, JSON.stringify(user));
    localStorage.setItem(this.storageTokenKey, token);
  }
}
