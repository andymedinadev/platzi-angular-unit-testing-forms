import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReversePipe } from './reverse.pipe';
import { query } from 'src/testing';

describe('Tests to ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform "text" to "txet"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform('text');
    expect(rta).toEqual('txet');
  });

  it('should transform "123" to "321"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform('123');
    expect(rta).toEqual('321');
  });
});

@Component({
  template: `
    <h1>Test Pipes</h1>
    <h5>{{ 'some text' | reverse }}</h5>
    <input [(ngModel)]="defaultText" />
    <p>{{ defaultText | reverse }}</p>
  `,
})
class HostComponent {
  defaultText = '';
}

describe('Tests to ReversePipe from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReversePipe, HostComponent],
      imports: [FormsModule],
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

  it('should h5 be "txet emos"', () => {
    // Arrange
    const headingDebug = query(fixture, 'h5');
    const headingElement = headingDebug.nativeElement as HTMLHeadingElement;
    const text = headingElement.textContent;

    // Assert
    expect(text).toEqual('txet emos');
  });

  it('should apply reverse type on input changes', () => {
    // Arrange
    const inputDebug = query(fixture, 'input');
    const paragraphDebug = query(fixture, 'p');

    const inputElement = inputDebug.nativeElement as HTMLInputElement;
    const pElement = paragraphDebug.nativeElement as HTMLParagraphElement;

    // Assert
    expect(pElement.textContent).toEqual('');

    // Act
    inputElement.value = 'Testing';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(pElement.textContent).toEqual('gnitseT');
  });
});
