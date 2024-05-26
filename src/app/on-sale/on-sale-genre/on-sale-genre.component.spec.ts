import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSaleGenreComponent } from './on-sale-genre.component';

describe('OnSaleGenreComponent', () => {
  let component: OnSaleGenreComponent;
  let fixture: ComponentFixture<OnSaleGenreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnSaleGenreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnSaleGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
