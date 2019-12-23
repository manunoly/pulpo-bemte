import { TestBed } from '@angular/core/testing';

import { UploadFileImageService } from './upload-file-image.service';

describe('UploadFileImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadFileImageService = TestBed.get(UploadFileImageService);
    expect(service).toBeTruthy();
  });
});
