import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListesComponent } from './listes.component';

describe('ListesComponent', () => {
  let component: ListesComponent;
  let fixture: ComponentFixture<ListesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
