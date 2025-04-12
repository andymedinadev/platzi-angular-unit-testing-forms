import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MyValidators } from 'src/app/utils/validators';
import { UsersService } from 'src/app/services/user.service';
import { CreateUserDTO } from 'src/app/models';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  form = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          MyValidators.validPassword,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      checkTerms: [false, [Validators.requiredTrue]],
    },
    {
      validators: MyValidators.matchPasswords,
    }
  );

  status: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(private fb: FormBuilder, private usersService: UsersService) {}

  ngOnInit(): void {}

  private buildRegisterDTO(): CreateUserDTO {
    const { name, email, password } = this.form.value;
    return { name, email, password, role: 'customer' };
  }

  register(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.status = 'loading';

      const dto = this.buildRegisterDTO();

      this.usersService.create(dto).subscribe({
        next: (rta) => {
          // redirect
          // alert
          console.log(rta);
          this.status = 'success';
        },
        error: () => {
          // redirect
          // alert
          this.status = 'error';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  get nameField() {
    return this.form.get('name');
  }

  get emailField() {
    return this.form.get('email');
  }

  get passwordField() {
    return this.form.get('password');
  }

  get confirmPasswordField() {
    return this.form.get('confirmPassword');
  }

  get checkTermsField() {
    return this.form.get('checkTerms');
  }
}
