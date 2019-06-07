import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaClasesPage } from './lista-clases.page';

describe('ListaClasesPage', () => {
  let component: ListaClasesPage;
  let fixture: ComponentFixture<ListaClasesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaClasesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaClasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
