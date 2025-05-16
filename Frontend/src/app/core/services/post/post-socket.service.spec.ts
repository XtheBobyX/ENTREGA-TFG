import { TestBed } from '@angular/core/testing';

import { PostSocketService } from './post-socket.service';

describe('PostSocketService', () => {
  let service: PostSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
