import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCompComponent } from './liste-comp.component';

describe('ListeCompComponent', () => {
  let component: ListeCompComponent;
  let fixture: ComponentFixture<ListeCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeCompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
