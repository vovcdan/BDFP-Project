import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppDialogComponent } from './supp-dialog.component';

describe('SuppDialogComponent', () => {
  let component: SuppDialogComponent;
  let fixture: ComponentFixture<SuppDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
