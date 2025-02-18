import { ContentTypeValidationGuard } from './content-type-validation.guard';

describe('ContentTypeValidationGuard', () => {
  it('should be defined', () => {
    expect(new ContentTypeValidationGuard()).toBeDefined();
  });
});
