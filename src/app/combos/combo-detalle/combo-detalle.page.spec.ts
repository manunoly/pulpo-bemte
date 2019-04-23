import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboDetallePage } from './combo-detalle.page';

describe('ComboDetallePage', () => {
  let component: ComboDetallePage;
  let fixture: ComponentFixture<ComboDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboDetallePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
