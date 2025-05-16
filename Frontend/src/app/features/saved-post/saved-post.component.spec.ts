import { ComponentFixture, TestBed } from '@angular/core/testing';

import SavedPostComponent  from './saved-post.component';

describe('SavedPostComponent', () => {
  let component: SavedPostComponent;
  let fixture: ComponentFixture<SavedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
