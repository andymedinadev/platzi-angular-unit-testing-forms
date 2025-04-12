import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

import { query, queryById } from './finders';

export function setInputValue<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  value: string,
  useTestId: boolean = false
) {
  let inputDebug: DebugElement;

  try {
    inputDebug = useTestId
      ? queryById(fixture, selector)
      : query(fixture, selector);
  } catch (error) {
    console.error('original error:', error);
    throw new Error(`Input not found using selector: "${selector}"`);
  }

  const inputElement: HTMLInputElement = inputDebug.nativeElement;

  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input'));
  inputElement.dispatchEvent(new Event('blur'));
}

export function setCheckboxValue<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  value: boolean,
  useTestId: boolean = false
) {
  let inputDebug: DebugElement;

  try {
    inputDebug = useTestId
      ? queryById(fixture, selector)
      : query(fixture, selector);
  } catch (error) {
    console.error('original error:', error);
    throw new Error(`Input not found using selector: "${selector}"`);
  }

  const inputElement: HTMLInputElement = inputDebug.nativeElement;

  inputElement.checked = value;
  inputElement.dispatchEvent(new Event('change'));
  inputElement.dispatchEvent(new Event('blur'));
}
