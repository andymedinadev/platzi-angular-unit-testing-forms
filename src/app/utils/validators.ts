import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs';
import { UsersService } from '../services/user.service';

export class MyValidators {
  static isPriceValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);
    if (value > 10000) {
      return { price_invalid: true };
    }
    return null;
  }

  static validPassword(control: AbstractControl) {
    const value = control.value;
    if (!containsNumber(value)) {
      return { invalid_password: true };
    }
    return null;
  }

  static matchPasswords(control: AbstractControl) {
    const password = control?.get('password')?.value;
    const confirmPassword = control?.get('confirmPassword')?.value;

    if (password === undefined || confirmPassword === undefined) {
      throw new Error('matchPasswords: fields not found');
    }

    if (password !== confirmPassword) {
      return { match_password: true };
    }

    return null;
  }

  static validateEmailAsync(service: UsersService) {
    return (control: AbstractControl) => {
      const email = control.value;
      return service.isAvailableByEmail(email).pipe(
        map((response) => {
          const isAvailable = response.isAvailable;

          if (!isAvailable) {
            return { not_available: true };
          } else {
            return null;
          }
        })
      );
    };
  }
}

function containsNumber(value: string) {
  return value.split('').find((v) => isNumber(v)) !== undefined;
}

function isNumber(value: string) {
  return !isNaN(parseInt(value, 10));
}
