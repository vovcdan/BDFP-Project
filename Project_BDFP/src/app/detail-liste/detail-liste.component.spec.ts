import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailListeComponent } from './detail-liste.component';

describe('DetailListeComponent', () => {
  let component: DetailListeComponent;
  let fixture: ComponentFixture<DetailListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailListeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
