//Rai Fenoll. Guard.

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';

//Este guard va a decir que si esta autenticado, entra al dashboard si no, no
export const isAuthenicatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  //Si esta autenticado, devuelve true
  if (authService.authStatus() === AuthStatus.authenticated) {
    return true;
  }

  //Si no redirige al loigin y da falso
  router.navigateByUrl('/auth/login');
  return false;
};
