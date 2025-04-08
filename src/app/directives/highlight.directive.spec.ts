import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HighlightDirective } from './highlight.directive';

@Component({
  template: `
    <h5>Not highlighted</h5>
    <h5 class="default-title" highlight>Highlighted (default)</h5>
    <p [highlight]="'yellow'">some text highlighted</p>
    <p [highlight]="'red'">more text highlighted</p>
    <input [(ngModel)]="color" [highlight]="color" />
  `,
})
class HostComponent {
  color = 'gray';
}

describe('Tests for HighlightDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, HighlightDirective],
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

  it('should have three highlighted elements', () => {
    const highlightedDebugElements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );

    expect(highlightedDebugElements.length).toEqual(4);
  });

  it('should elements match bgColor', () => {
    // Arrange
    const highlightedDebugElements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );

    const firstHighlightedElement = highlightedDebugElements[0]
      .nativeElement as HTMLElement;

    const secondHighlightedElement = highlightedDebugElements[1]
      .nativeElement as HTMLElement;

    const thirdHighlightedElement = highlightedDebugElements[2]
      .nativeElement as HTMLElement;

    // Assert
    expect(firstHighlightedElement.style.backgroundColor).toEqual('gray');
    expect(secondHighlightedElement.style.backgroundColor).toEqual('yellow');
    expect(thirdHighlightedElement.style.backgroundColor).toEqual('red');
  });

  it('should apply default color to .default-title', () => {
    // Arrange
    const titleDebugElement = fixture.debugElement.query(
      By.css('.default-title')
    );
    const titleElement = titleDebugElement.nativeElement as HTMLHeadingElement;
    const backgroundColor = titleElement.style.backgroundColor;

    const directive = titleDebugElement.injector.get(HighlightDirective);

    // Assert
    expect(backgroundColor).toEqual(directive.defaultColor);
  });

  it('should bind <input> and change bgColor', () => {
    // Arrange
    const inputDebugElement = fixture.debugElement.query(By.css('input'));
    const inputElement = inputDebugElement.nativeElement as HTMLInputElement;
    const originalBackgroundColor = inputElement.style.backgroundColor;

    // Assert
    expect(originalBackgroundColor).toEqual(component.color);

    // Act
    const newBackgroundColor = 'red';
    inputElement.value = newBackgroundColor;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    const updatedBackgroundColor = inputElement.style.backgroundColor;
    expect(updatedBackgroundColor).toEqual(newBackgroundColor);
  });
});
