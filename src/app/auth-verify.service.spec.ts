import { TestBed, inject } from '@angular/core/testing';

import { AuthVerifyService } from './auth-verify.service';

describe('AuthVerifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthVerifyService]
    });
  });

  it('should be created', inject([AuthVerifyService], (service: AuthVerifyService) => {
    expect(service).toBeTruthy();
  }));
});
