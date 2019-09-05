import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GananciasProfesorPage } from './ganancias-profesor.page';

describe('GananciasProfesorPage', () => {
  let component: GananciasProfesorPage;
  let fixture: ComponentFixture<GananciasProfesorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GananciasProfesorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GananciasProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
