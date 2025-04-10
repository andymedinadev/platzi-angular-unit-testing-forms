import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterFormComponent } from './register-form.component';
import { UsersService } from 'src/app/services/user.service';
import { getText, query, setInputValue } from 'src/testing';

describe('Tests for RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['create']);

    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UsersService, useValue: usersServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the emailField be invalid', () => {
    component.emailField?.setValue('testing string not email');
    expect(component.emailField?.invalid)
      .withContext('random text')
      .toBeTruthy();

    component.emailField?.setValue('');
    expect(component.emailField?.invalid)
      .withContext('empty string')
      .toBeTruthy();
  });

  it('should the passwordField be invalid', () => {
    component.passwordField?.setValue('');
    expect(component.passwordField?.invalid)
      .withContext('empty string')
      .toBeTruthy();

    component.passwordField?.setValue('pass');
    expect(component.passwordField?.invalid)
      .withContext('too short password')
      .toBeTruthy();

    component.passwordField?.setValue('testPassword');
    expect(component.passwordField?.invalid)
      .withContext('text without any number')
      .toBeTruthy();
  });

  it('should the emailField be invalid from render', () => {
    // Arrange
    const inputDebug = query(fixture, '#email');
    const inputElement = inputDebug.nativeElement as HTMLInputElement;

    // Act
    inputElement.value = 'some invalid email';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Assert
    expect(component.emailField?.invalid).toBeTruthy();

    const textContent = getText(fixture, 'emailField-notValid');
    expect(textContent).toContain('Not a valid email');
  });

  it('should the emailField be invalid from render with helper', () => {
    // Act
    setInputValue(fixture, '#email', 'some invalid email');
    fixture.detectChanges();

    // Assert
    expect(component.emailField?.invalid).toBeTruthy();
    const textContent = getText(fixture, 'emailField-notValid');
    expect(textContent).toContain('Not a valid email');
  });
});
