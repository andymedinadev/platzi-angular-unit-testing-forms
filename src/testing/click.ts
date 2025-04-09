import { ComponentFixture } from '@angular/core/testing';
import { query, queryById } from './finders';

export function clickEvent<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  useTestId: boolean = false,
  event: Event | null = null
) {
  let elementDebug;

  try {
    elementDebug = useTestId
      ? queryById(fixture, selector)
      : query(fixture, selector);
  } catch (error) {
    console.error('original error:', error);
    throw new Error(`Element not found using selector: "${selector}"`);
  }

  elementDebug.triggerEventHandler('click', event);
}

export function clickElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  useTestId: boolean = false
) {
  let elementDebug;

  try {
    elementDebug = useTestId
      ? queryById(fixture, selector)
      : query(fixture, selector);
  } catch (error) {
    console.error('original error:', error);
    throw new Error(`Element not found using selector: "${selector}"`);
  }

  const element: HTMLElement = elementDebug.nativeElement;
  element.click();
}
