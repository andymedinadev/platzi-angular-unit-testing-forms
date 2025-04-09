import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { ProductService } from 'src/app/services/product.service';
import { ValueService } from 'src/app/services/value.service';
import { generateManyProducts } from 'src/app/models/product.mock';
import {
  asyncData,
  asyncError,
  getText,
  mockObservable,
  queryById,
} from 'src/testing';

describe('Tests for ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  let productService: jasmine.SpyObj<ProductService>;

  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj<ProductService>(
      'ProductService',
      ['getAll']
    );

    const valueServiceSpy = jasmine.createSpyObj('ValueService', [
      'getPromiseValue',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceSpy,
        },
        {
          provide: ValueService,
          useValue: valueServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;

    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;

    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call spy service on render', () => {
    // Arrange
    const productsMock = generateManyProducts(3);
    productService.getAll.and.returnValue(mockObservable(productsMock));

    // Act
    fixture.detectChanges(); // ngOnInit

    // Assert
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('Tests for getAllProducts', () => {
    it('should return product list from service', () => {
      // Arrange
      const productsMock = generateManyProducts(10); // 10 items
      productService.getAll.and.returnValue(mockObservable(productsMock));

      // Act
      component.getAllProducts(); // +10
      fixture.detectChanges(); // +10

      // Assert
      expect(component.products.length).toEqual(20);
    });

    it('should change the status "loading" to "success"', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(asyncData(productsMock));

      // Act
      component.getAllProducts();
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('loading');

      // Act
      tick();
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('success');
    }));

    it('should change the status "loading" to "error"', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(asyncError('errorTest'));

      // Act
      component.getAllProducts();
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('loading');

      // Act
      tick(4000);
      fixture.detectChanges();

      // Assert
      expect(component.status).toEqual('error');
    }));
  });

  describe('Tests for callPromise', () => {
    it('should call to the promise', async () => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(mockObservable(productsMock));

      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));

      // Act
      await component.callPromise();
      fixture.detectChanges(); // runs ngOnInit, needs productServiceSpy

      // Assert
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    });

    it('should show "my mock string" in <p> when btn clicked', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(mockObservable(productsMock));

      const mockMsg = 'my mock string';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));

      const buttonDebugElement = queryById<ProductsComponent>(
        fixture,
        'btn-promise'
      );

      // Act
      buttonDebugElement.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();

      // Assert
      const textContent = getText(fixture, 'rta-promise');
      expect(textContent).toContain(mockMsg);
    }));
  });
});
