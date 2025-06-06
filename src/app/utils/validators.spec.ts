import { FormControl, FormGroup } from '@angular/forms';
import { MyValidators } from 'src/app/utils/validators';
import { UsersService } from 'src/app/services/user.service';
import { mockObservable } from 'src/testing';

describe('Tests for MyValidators', () => {
  describe('Tests for validPassword', () => {
    it('should return null when password is valid', () => {
      // Arrange
      const control = new FormControl();
      control.setValue('test123');

      // Act
      const rta = MyValidators.validPassword(control); // validPassword -> should contain numbers

      // Assert
      expect(rta).toBeNull();
    });

    it('should return object when password is not valid', () => {
      // Arrange
      const control = new FormControl();
      control.setValue('testTest');

      // Act
      const rta = MyValidators.validPassword(control); // validPassword -> should contain numbers

      // Assert
      expect(rta?.invalid_password).toBeTrue();
    });
  });

  describe('Tests for matchPasswords', () => {
    it('should return null when passwords match', () => {
      // Arrange
      const group = new FormGroup({
        password: new FormControl('test123'),
        confirmPassword: new FormControl('test123'),
      });

      // Act
      const rta = MyValidators.matchPasswords(group);

      // Assert
      expect(rta).toBeNull(); // null means no errors
    });

    it("should return object when passwords don't match", () => {
      // Arrange
      const group = new FormGroup({
        password: new FormControl('test123'),
        confirmPassword: new FormControl('test1234'),
      });

      // Act
      const rta = MyValidators.matchPasswords(group);

      // Assert
      expect(rta?.match_password).toBeTrue(); // true means error
    });

    it('should throw Error when fields not found', () => {
      // Arrange
      const group = new FormGroup({
        user: new FormControl('username'),
        password: new FormControl('password1'),
      });

      // Act
      const fn = () => MyValidators.matchPasswords(group);

      // Assert
      expect(fn).toThrow(new Error('matchPasswords: fields not found'));
    });
  });

  describe('Tests for validateEmailAsync', () => {
    it('should return null with valid email', (doneFn) => {
      // Arrange
      const control = new FormControl('test@mail.com');

      const usersServiceSpy: jasmine.SpyObj<UsersService> =
        jasmine.createSpyObj('UsersService', ['isAvailableByEmail']);

      // mock response
      usersServiceSpy.isAvailableByEmail.and.returnValue(
        mockObservable({ isAvailable: true })
      );

      const validator = MyValidators.validateEmailAsync(usersServiceSpy);

      // Act
      validator(control).subscribe((rta) => {
        // Assert
        expect(rta).toBeNull();
        doneFn();
      });
    });
  });
});
