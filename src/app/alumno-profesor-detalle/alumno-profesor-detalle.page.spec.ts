import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoProfesorDetallePage } from './alumno-profesor-detalle.page';

describe('AlumnoProfesorDetallePage', () => {
  let component: AlumnoProfesorDetallePage;
  let fixture: ComponentFixture<AlumnoProfesorDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnoProfesorDetallePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoProfesorDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
