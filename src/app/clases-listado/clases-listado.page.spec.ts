import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesListadoPage } from './clases-listado.page';

describe('ClasesListadoPage', () => {
  let component: ClasesListadoPage;
  let fixture: ComponentFixture<ClasesListadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesListadoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesListadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
