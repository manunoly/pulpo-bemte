import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseGratisPage } from './clase-gratis.page';

describe('ClaseGratisPage', () => {
  let component: ClaseGratisPage;
  let fixture: ComponentFixture<ClaseGratisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseGratisPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaseGratisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
