import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { getText, query, queryById } from 'src/testing';
import { PersonComponent } from './person.component';
import { Person } from 'src/app/models';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the name be "Tester"', () => {
    component.person = new Person('Tester', 'LastTest', 20, 100, 1.7);
    expect(component.person.name).toEqual('Tester');
  });

  it('should have <h3> element with text: "Hello, {person.name}"', () => {
    // Arrange
    component.person = new Person('Tester', 'LastTest', 20, 100, 1.7);
    const expectedMsg = 'Hello, Tester';

    // Act
    fixture.detectChanges();

    // Assert
    const textContent = getText(fixture, 'heading-name');
    expect(textContent).toEqual(expectedMsg);
  });

  it('should have <p> element with text: "My height is: {person.height}"', () => {
    // Arrange
    component.person = new Person('Tester', 'LastTest', 20, 100, 1.7);
    const expectedMsg = 'My height is: 1.7';

    // Act
    fixture.detectChanges();

    // Assert
    const textContent = getText(fixture, 'p-height');
    expect(textContent).toEqual(expectedMsg);
  });

  it('should display a text with IMC when calcIMC is called', () => {
    // Arrange
    component.person = new Person('Tester', 'LastTest', 20, 120, 1.65);
    const expectedMsg = 'overweight level 3';

    // Act
    component.calcIMC();
    fixture.detectChanges();

    // Assert
    const textContent = getText(fixture, 'btn-imc');
    expect(textContent).toContain(expectedMsg);
  });

  it('should display a text with IMC when clicked', () => {
    // Arrange
    component.person = new Person('Tester', 'LastTest', 20, 120, 1.65);
    const expectedMsg = 'overweight level 3';

    const buttonDebug: DebugElement = queryById(fixture, 'btn-imc');

    // Act
    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    const textContent = getText(fixture, 'btn-imc');
    expect(textContent).toContain(expectedMsg);
  });

  it('should raise selected event when clicked', () => {
    //Arrange
    const expectedPerson = new Person('Tester', 'LastTest', 20, 100, 1.7);
    component.person = expectedPerson;

    const buttonDebug = queryById(fixture, 'btn-choose');

    let selectedPerson: Person | undefined;
    component.onSelected.subscribe((person) => (selectedPerson = person));

    //Act
    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    //Assert
    expect(selectedPerson).toEqual(expectedPerson);
  });
});

@Component({
  template: `<app-person
    [person]="personToInput"
    (onSelected)="onSelected($event)"
  ></app-person>`,
})
class HostComponent {
  personToInput = new Person('HostName', 'LastNameHost', 30, 120, 1.6);

  personFromOutput: Person | undefined;

  onSelected(person: Person) {
    this.personFromOutput = person;
  }
}

describe('PersonComponent from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    // Arrange
    const expectedPersonName = component.personToInput.name;

    // Act
    fixture.detectChanges();

    // Assert
    const textContent = getText(fixture, 'heading-name');
    expect(textContent).toContain(expectedPersonName);
  });

  it('should raise selected event when clicked', () => {
    // Arrange
    const buttonDebugElement = queryById(fixture, 'btn-choose');

    // Act
    buttonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    expect(component.personToInput).toEqual(component.personFromOutput!);
  });
});
