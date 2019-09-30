import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidarPassPage } from './olvidar-pass.page';

describe('OlvidarPassPage', () => {
  let component: OlvidarPassPage;
  let fixture: ComponentFixture<OlvidarPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlvidarPassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidarPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
