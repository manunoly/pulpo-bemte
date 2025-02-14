import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseDetallesPage } from './clase-detalles.page';

describe('ClaseDetallesPage', () => {
  let component: ClaseDetallesPage;
  let fixture: ComponentFixture<ClaseDetallesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseDetallesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaseDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
