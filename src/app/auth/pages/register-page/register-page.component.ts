import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm: FormGroup = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]],
    confirmPassword: ['',[Validators.required, Validators.minLength(6)]]
  });

  //ver si las contraseñas coinciden
  passwordsMatch(): boolean {
    const { password, confirmPassword } = this.registerForm.value;
    return password === confirmPassword;
  }

  //Register method
  register(): void {

    if (this.registerForm.valid && this.passwordsMatch()) {
      const { email, password } = this.registerForm.value;

      this.authService.register(email, password, false)
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (message: any) => {
        Swal.fire('Registro no realizado', message, 'error')
      }
    })
    }
  }
}
