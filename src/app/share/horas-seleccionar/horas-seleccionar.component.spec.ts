import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorasSeleccionarComponent } from './horas-seleccionar.component';

describe('HorasSeleccionarComponent', () => {
  let component: HorasSeleccionarComponent;
  let fixture: ComponentFixture<HorasSeleccionarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorasSeleccionarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorasSeleccionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
