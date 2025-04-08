import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  people: Person[] = [
    new Person('peopleName', 'peopleLastName', 30, 160, 1.8),
    new Person('peopleName2', 'peopleLastName2', 40, 120, 1.7),
  ];

  selectedPerson: Person | null = null;

  constructor() {}

  ngOnInit(): void {}

  choose(person: Person) {
    this.selectedPerson = person;
  }
}
