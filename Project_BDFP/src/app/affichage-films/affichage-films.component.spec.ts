import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageFilmsComponent } from './affichage-films.component';

describe('AffichageFilmsComponent', () => {
  let component: AffichageFilmsComponent;
  let fixture: ComponentFixture<AffichageFilmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffichageFilmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffichageFilmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
