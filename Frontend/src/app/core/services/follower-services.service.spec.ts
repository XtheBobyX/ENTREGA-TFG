import { TestBed } from '@angular/core/testing';

import { FollowerService } from './follower-services.service';

describe('FollowerServicesService', () => {
  let service: FollowerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
