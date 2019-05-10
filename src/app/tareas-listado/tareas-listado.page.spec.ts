import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasListadoPage } from './tareas-listado.page';

describe('TareasListadoPage', () => {
  let component: TareasListadoPage;
  let fixture: ComponentFixture<TareasListadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TareasListadoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TareasListadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
