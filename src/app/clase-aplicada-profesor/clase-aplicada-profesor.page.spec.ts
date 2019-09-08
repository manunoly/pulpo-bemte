import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseAplicadaProfesorPage } from './clase-aplicada-profesor.page';

describe('ClaseAplicadaProfesorPage', () => {
  let component: ClaseAplicadaProfesorPage;
  let fixture: ComponentFixture<ClaseAplicadaProfesorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseAplicadaProfesorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaseAplicadaProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
