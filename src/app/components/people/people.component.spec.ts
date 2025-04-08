import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PeopleComponent } from './people.component';
import { PersonComponent } from '../person/person.component';
import { Person } from 'src/app/models';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of app-person components', () => {
    // Arrange
    const dataForTest = [
      new Person('peopleName', 'peopleLastName', 30, 160, 1.8),
      new Person('peopleName2', 'peopleLastName2', 40, 120, 1.7),
      new Person('peopleName3', 'peopleLastName3', 40, 120, 1.7),
      new Person('peopleName4', 'peopleLastName4', 40, 120, 1.7),
    ];

    // Act
    component.people = dataForTest;
    fixture.detectChanges();

    const debugElementArray = fixture.debugElement.queryAll(
      By.css('app-person')
    );

    // Assert
    expect(debugElementArray.length).toEqual(dataForTest.length);
  });

  it('should render clicked person info', () => {
    // Arrange
    const dataForTest = [
      new Person('peopleName', 'peopleLastName', 30, 160, 1.8),
      new Person('peopleName2', 'peopleLastName2', 40, 120, 1.7),
      new Person('peopleName3', 'peopleLastName3', 40, 120, 1.7),
      new Person('peopleName4', 'peopleLastName4', 40, 120, 1.7),
    ];

    // Act
    component.people = dataForTest;
    fixture.detectChanges();

    // Arrange
    const peopleDebugElement = fixture.debugElement;
    const buttonDebugArray = peopleDebugElement.queryAll(By.css('.btn-choose'));
    const thirdButton = buttonDebugArray[2];

    // Act
    thirdButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Arrange
    const listItemDebugArray = peopleDebugElement.queryAll(By.css('li'));
    const firstListItemDebug = listItemDebugArray[0];
    const firstListItemElement = firstListItemDebug.nativeElement;

    // Assert
    expect(firstListItemElement.textContent).toContain(dataForTest[2].name);
  });
});
