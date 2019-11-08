import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfeEstadoCuentaPage } from './profe-estado-cuenta.page';

describe('ProfeEstadoCuentaPage', () => {
  let component: ProfeEstadoCuentaPage;
  let fixture: ComponentFixture<ProfeEstadoCuentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfeEstadoCuentaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfeEstadoCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
