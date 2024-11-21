//Rai. login page

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: ['rai@gmail.com', [Validators.required, Validators.email]],
    password: ['4fhattahapde', [Validators.required, Validators.minLength(6)]]
  });

  //login de la aplicacion
  login() {

    const {email, password} = this.myForm.value;

    this.authService.login(email, password)
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (message: any) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }
}
