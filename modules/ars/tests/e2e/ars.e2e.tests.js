'use strict';

describe('Ars E2E Tests:', function () {
  describe('Test Ars page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ars');
      expect(element.all(by.repeater('ar in ars')).count()).toEqual(0);
    });
  });
});
