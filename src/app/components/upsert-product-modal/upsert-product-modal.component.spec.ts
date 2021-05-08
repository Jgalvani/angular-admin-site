import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertProductModalComponent } from './upsert-product-modal.component';

describe('EditModalComponent', () => {
  let component: UpsertProductModalComponent;
  let fixture: ComponentFixture<UpsertProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertProductModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
