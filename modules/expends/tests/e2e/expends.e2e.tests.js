'use strict';

describe('Expends E2E Tests:', function () {
  describe('Test Expends page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/expends');
      expect(element.all(by.repeater('expend in expends')).count()).toEqual(0);
    });
  });
});
