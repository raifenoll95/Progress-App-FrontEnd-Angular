import { Component, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'authApp';

  private authService = inject(AuthService);
  public finishedAuthCheck = () => {
    if(this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  }
}
