import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

import { clickEvent, clickElement } from './click';

describe('Tests for clickEvent', () => {
  it('should throw if element not found', () => {
    const fakeFixture = {
      debugElement: {
        query: () => null,
      },
    } as unknown as ComponentFixture<unknown>;

    const selector = 'some-selector';

    expect(() => clickEvent(fakeFixture, selector)).toThrowError(
      `Element not found using selector: "${selector}"`
    );
  });

  it('should throw if element not found with testId', () => {
    const fakeFixture = {
      debugElement: {
        query: () => null,
        queryAll: () => [],
      },
    } as unknown as ComponentFixture<unknown>;

    const selector = 'test-id';

    expect(() => clickEvent(fakeFixture, selector, true)).toThrowError(
      `Element not found using selector: "${selector}"`
    );
  });

  it('should trigger click event with custom event', () => {
    const triggerSpy = jasmine.createSpy('triggerEventHandler');

    const fakeElement: DebugElement = {
      triggerEventHandler: triggerSpy,
    } as any;

    const fakeFixture = {
      debugElement: {
        query: () => fakeElement,
      },
    } as unknown as ComponentFixture<unknown>;

    const customEvent = { test: 'data' } as unknown as Event;
    clickEvent(fakeFixture, 'selector', false, customEvent);

    expect(triggerSpy).toHaveBeenCalledWith('click', customEvent);
  });
});

describe('Tests for clickElement', () => {
  it('should throw if element not found', () => {
    const fakeFixture = {
      debugElement: {
        query: () => null,
      },
    } as unknown as ComponentFixture<unknown>;

    const selector = 'some-selector';

    expect(() => clickElement(fakeFixture, selector)).toThrowError(
      `Element not found using selector: "${selector}"`
    );
  });

  it('should throw if element not found with testId', () => {
    const fakeFixture = {
      debugElement: {
        query: () => null,
        queryAll: () => [],
      },
    } as unknown as ComponentFixture<unknown>;

    const selector = 'test-id';
    expect(() => clickElement(fakeFixture, selector, true)).toThrowError(
      `Element not found using selector: "${selector}"`
    );
  });

  it('should trigger click on element', () => {
    const clickSpy = jasmine.createSpy('click');

    const fakeElement: HTMLElement = {
      click: clickSpy,
    } as any;

    const fakeFixture = {
      debugElement: {
        query: () => ({ nativeElement: fakeElement }),
      },
    } as unknown as ComponentFixture<unknown>;

    clickElement(fakeFixture, 'selector', false);

    expect(clickSpy).toHaveBeenCalled();
  });
});
