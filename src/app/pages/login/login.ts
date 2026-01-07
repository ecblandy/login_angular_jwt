import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    console.log('SUBMIT', this.form.value);
    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('login done', res);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = 'Login Failed';
      },
    });
  }

  createAccount() {
    const { email, password } = this.form.getRawValue();

    this.authService
      .register(email, password)
      .pipe(
        // se registrar com sucesso, já loga
        switchMap(() => this.authService.login(email, password))
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          console.error(err);
          this.error = err.error?.msg ?? 'Registration Failed';
          this.cdr.detectChanges(); // força update apenas uma vez
        },
      });
  }
}
