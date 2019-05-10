import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasPagarPage } from './tareas-pagar.page';

describe('TareasPagarPage', () => {
  let component: TareasPagarPage;
  let fixture: ComponentFixture<TareasPagarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TareasPagarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TareasPagarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
