import { ComponentFixture } from '@angular/core/testing';
import { query, queryById } from './finders';

export function clickEvent<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  useTestId: boolean = false,
  event: Event | null = null
) {
  const elementDebug = useTestId
    ? queryById(fixture, selector)
    : query(fixture, selector);

  if (!elementDebug) {
    throw new Error(`Element not found using selector: "${selector}"`);
  }

  elementDebug.triggerEventHandler('click', event);
}

export function clickElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  useTestId: boolean = false
) {
  const elementDebug = useTestId
    ? queryById(fixture, selector)
    : query(fixture, selector);

  if (!elementDebug) {
    throw new Error(`Element not found using selector: "${selector}"`);
  }

  const element: HTMLElement = elementDebug.nativeElement;
  element.click();
}
