import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesPagarPage } from './clases-pagar.page';

describe('ClasesPagarPage', () => {
  let component: ClasesPagarPage;
  let fixture: ComponentFixture<ClasesPagarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesPagarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesPagarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
