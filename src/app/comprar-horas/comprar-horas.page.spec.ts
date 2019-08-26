import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprarHorasPage } from './comprar-horas.page';

describe('ComprarHorasPage', () => {
  let component: ComprarHorasPage;
  let fixture: ComponentFixture<ComprarHorasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprarHorasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprarHorasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
