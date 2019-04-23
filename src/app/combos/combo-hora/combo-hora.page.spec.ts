import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboHoraPage } from './combo-hora.page';

describe('ComboHoraPage', () => {
  let component: ComboHoraPage;
  let fixture: ComponentFixture<ComboHoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboHoraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboHoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
