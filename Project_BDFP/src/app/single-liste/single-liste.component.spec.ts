import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleListeComponent } from './single-liste.component';

describe('SingleListeComponent', () => {
  let component: SingleListeComponent;
  let fixture: ComponentFixture<SingleListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleListeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
