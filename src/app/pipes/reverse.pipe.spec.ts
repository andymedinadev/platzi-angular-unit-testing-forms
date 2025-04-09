import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReversePipe } from './reverse.pipe';
import { getText, query } from 'src/testing';

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
    <h5 data-testid="heading-reverse">{{ 'some text' | reverse }}</h5>
    <input [(ngModel)]="defaultText" />
    <p data-testid="paragraph-reverse">{{ defaultText | reverse }}</p>
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
    const textContent = getText(fixture, 'heading-reverse');

    // Assert
    expect(textContent).toEqual('txet emos');
  });

  it('should apply reverse type on input changes', () => {
    // Arrange
    const inputDebug = query(fixture, 'input');
    const inputElement = inputDebug.nativeElement as HTMLInputElement;

    // Assert
    const originalTextContent = getText(fixture, 'paragraph-reverse');
    expect(originalTextContent).toEqual('');

    // Act
    inputElement.value = 'Testing';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    const updatedTextContent = getText(fixture, 'paragraph-reverse');
    expect(updatedTextContent).toEqual('gnitseT');
  });
});
