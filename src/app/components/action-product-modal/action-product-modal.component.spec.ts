import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionProductModalComponent } from './action-product-modal.component';

describe('ActionProductModalComponent', () => {
  let component: ActionProductModalComponent;
  let fixture: ComponentFixture<ActionProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionProductModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
