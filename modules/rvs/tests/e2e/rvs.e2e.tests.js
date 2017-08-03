'use strict';

describe('Rvs E2E Tests:', function () {
  describe('Test Rvs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/rvs');
      expect(element.all(by.repeater('rv in rvs')).count()).toEqual(0);
    });
  });
});
