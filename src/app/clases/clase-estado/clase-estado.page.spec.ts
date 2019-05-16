import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseEstadoPage } from './clase-estado.page';

describe('ClaseEstadoPage', () => {
  let component: ClaseEstadoPage;
  let fixture: ComponentFixture<ClaseEstadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseEstadoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaseEstadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
