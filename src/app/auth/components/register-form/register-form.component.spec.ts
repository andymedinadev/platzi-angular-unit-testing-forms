import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RegisterFormComponent } from './register-form.component';
import { UsersService } from 'src/app/services/user.service';
import { generateOneUser } from 'src/app/models/user.mock';
import {
  asyncData,
  asyncError,
  clickElement,
  getText,
  mockObservable,
  query,
  setCheckboxValue,
  setInputValue,
} from 'src/testing';

describe('Tests for RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'create',
      'isAvailableByEmail',
    ]);

    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UsersService, useValue: usersServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    usersServiceSpy.isAvailableByEmail.and.returnValue(
      mockObservable({ isAvailable: true })
    );
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

  it('should not submit incomplete forms', () => {
    // Arrange
    component.form.patchValue({
      name: 'testName',
      password: '12345678',
    });

    // Act
    component.register(new Event('submit'));

    // Assert
    expect(component.form.invalid).toBeTruthy();
    expect(usersServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should submit form succesfully', () => {
    // Arrange
    const mockFormData = {
      name: 'testName',
      email: 'test@mail.com',
      password: '12345678',
      confirmPassword: '12345678',
      checkTerms: true,
    };
    component.form.patchValue(mockFormData);

    const mockUserFromService = generateOneUser();
    usersServiceSpy.create.and.returnValue(mockObservable(mockUserFromService));

    // Act
    component.register(new Event('submit'));

    // Assert
    expect(component.form.valid).toBeTruthy();
    expect(usersServiceSpy.create).toHaveBeenCalled();
  });

  it('should change status when submit', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      name: 'testName',
      email: 'test@mail.com',
      password: '12345678',
      confirmPassword: '12345678',
      checkTerms: true,
    };
    component.form.patchValue(mockFormData);

    const mockUserFromService = generateOneUser();
    usersServiceSpy.create.and.returnValue(asyncData(mockUserFromService));

    // Act
    expect(component.form.valid).toBeTruthy();
    component.register(new Event('submit'));
    expect(component.status).toEqual('loading');

    tick();

    // Assert
    expect(usersServiceSpy.create).toHaveBeenCalled();
    expect(component.status).toEqual('success');
  }));

  it('should submit form succesfully from rendered UI', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      name: 'testName',
      email: 'test@mail.com',
      password: '12345678',
      confirmPassword: '12345678',
      checkTerms: true,
    };

    setInputValue(fixture, 'input#name', mockFormData.name);
    setInputValue(fixture, 'input#email', mockFormData.email);
    setInputValue(fixture, 'input#password', mockFormData.password);
    setInputValue(
      fixture,
      'input#confirmPassword',
      mockFormData.confirmPassword
    );
    setCheckboxValue(fixture, 'input#terms', mockFormData.checkTerms);

    const mockUserFromService = generateOneUser();
    usersServiceSpy.create.and.returnValue(asyncData(mockUserFromService));

    // Act
    expect(component.form.valid).toBeTruthy();
    clickElement(fixture, 'btn-submit', true);
    fixture.detectChanges();
    expect(component.status).toEqual('loading');

    tick();
    fixture.detectChanges();

    // Assert
    expect(usersServiceSpy.create).toHaveBeenCalled();
    expect(component.status).toEqual('success');
  }));

  it('should submit form from UI but service fails', fakeAsync(() => {
    // Arrange
    const mockFormData = {
      name: 'testName',
      email: 'test@mail.com',
      password: '12345678',
      confirmPassword: '12345678',
      checkTerms: true,
    };

    setInputValue(fixture, 'input#name', mockFormData.name);
    setInputValue(fixture, 'input#email', mockFormData.email);
    setInputValue(fixture, 'input#password', mockFormData.password);
    setInputValue(
      fixture,
      'input#confirmPassword',
      mockFormData.confirmPassword
    );
    setCheckboxValue(fixture, 'input#terms', mockFormData.checkTerms);

    usersServiceSpy.create.and.returnValue(
      asyncError('Error: Service not working')
    );

    // Act
    expect(component.form.valid).toBeTruthy();
    clickElement(fixture, 'btn-submit', true);
    fixture.detectChanges();
    expect(component.status).toEqual('loading');

    tick();
    fixture.detectChanges();

    // Assert
    expect(usersServiceSpy.create).toHaveBeenCalled();
    expect(component.status).toEqual('error');
  }));

  it('should return error when email already in use', () => {
    // Arrange
    usersServiceSpy.isAvailableByEmail.and.returnValue(
      mockObservable({ isAvailable: false }) // mock service response
    );

    const testEmail = 'test@mail.com';

    // Act
    setInputValue(fixture, 'input#email', testEmail);
    fixture.detectChanges();

    const textContent = getText(fixture, 'emailField-notAvailable');

    // Assert
    expect(component.emailField?.invalid).toBeTrue();
    expect(usersServiceSpy.isAvailableByEmail).toHaveBeenCalledWith(testEmail);
    expect(textContent).toContain('Email already in use');
  });
});
