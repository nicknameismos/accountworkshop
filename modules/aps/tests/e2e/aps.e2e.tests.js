'use strict';

describe('Aps E2E Tests:', function () {
  describe('Test Aps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/aps');
      expect(element.all(by.repeater('ap in aps')).count()).toEqual(0);
    });
  });
});
