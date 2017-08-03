'use strict';

describe('Jvs E2E Tests:', function () {
  describe('Test Jvs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/jvs');
      expect(element.all(by.repeater('jv in jvs')).count()).toEqual(0);
    });
  });
});
