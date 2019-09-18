import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioProfesorPage } from './inicio-profesor.page';

describe('InicioProfesorPage', () => {
  let component: InicioProfesorPage;
  let fixture: ComponentFixture<InicioProfesorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioProfesorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
