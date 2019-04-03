import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriasPage } from './materias.page';

describe('MateriasPage', () => {
  let component: MateriasPage;
  let fixture: ComponentFixture<MateriasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateriasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
