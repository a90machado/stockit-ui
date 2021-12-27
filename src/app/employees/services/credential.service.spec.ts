/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CredentialService } from './credential.service';

describe('Service: Credential', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CredentialService]
    });
  });

  it('should ...', inject([CredentialService], (service: CredentialService) => {
    expect(service).toBeTruthy();
  }));
});
