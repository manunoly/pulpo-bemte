import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombosPage } from './combos.page';

describe('CombosPage', () => {
  let component: CombosPage;
  let fixture: ComponentFixture<CombosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
