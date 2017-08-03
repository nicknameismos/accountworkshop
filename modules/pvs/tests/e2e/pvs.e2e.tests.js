'use strict';

describe('Pvs E2E Tests:', function () {
  describe('Test Pvs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pvs');
      expect(element.all(by.repeater('pv in pvs')).count()).toEqual(0);
    });
  });
});
