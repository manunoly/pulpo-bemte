import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTareasPage } from './lista-tareas.page';

describe('ListaTareasPage', () => {
  let component: ListaTareasPage;
  let fixture: ComponentFixture<ListaTareasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTareasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTareasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
