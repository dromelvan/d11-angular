import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersPageComponent } from './transfers-page.component';

describe('TransfersPageComponent', () => {
  let component: TransfersPageComponent;
  let fixture: ComponentFixture<TransfersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransfersPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
