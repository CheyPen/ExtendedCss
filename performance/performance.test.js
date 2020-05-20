(function () {
    'use strict';

    /* eslint-disable max-len */
    var _exports = exports,
        ExtendedSelectorFactory = _exports.ExtendedSelectorFactory;
    var _exports2 = exports,
        initializeSizzle = _exports2.initializeSizzle;
    var Sizzle = initializeSizzle();
    var LOOP_COUNT = 10000;

    var performanceTest = function performanceTest(selector, assert) {
      var startTime = new Date().getTime();
      var iCount = LOOP_COUNT;
      var resultOk = true;

      while (iCount--) {
        var nodes = selector.querySelectorAll();

        if (!nodes || !nodes.length) {
          resultOk = false;
        }
      }

      var elapsed = new Date().getTime() - startTime;
      var msg = "Elapsed: ".concat(elapsed, " ms ");
      msg += "Count: ".concat(LOOP_COUNT, " ");
      msg += "Average: ".concat(elapsed / LOOP_COUNT, " ms");
      console.log(msg, assert.test.testName); // eslint-disable-line no-console

      assert.ok(resultOk, msg);
    };

    QUnit.test('Tokenize performance', function (assert) {
      initializeSizzle();
      var selectorText = "#case5 > div:not([style^=\"min-height:\"]) > div[id][data-uniqid^=\"toolkit-\"]:not([data-bem]):not([data-mnemo])[-ext-has='a[href^=\"https://an.yandex.\"]>img']";
      var startTime = new Date().getTime();
      var resultOk = true;
      var iCount = LOOP_COUNT;

      while (iCount--) {
        var tokens = Sizzle.tokenize(selectorText, false, {
          returnUnsorted: true
        });

        if (!tokens || !tokens.length) {
          resultOk = false;
        }
      }

      var elapsed = new Date().getTime() - startTime;
      var msg = "Elapsed: ".concat(elapsed, " ms\n");
      msg += "Count: ".concat(LOOP_COUNT, "\n");
      msg += "Average: ".concat(elapsed / LOOP_COUNT, " ms");
      assert.ok(resultOk, msg);
    });
    QUnit.test('Test simple selector', function (assert) {
      var selector = {
        querySelectorAll: function querySelectorAll() {
          return document.querySelectorAll('.container #case1 div div');
        }
      };
      performanceTest(selector, assert);
    });
    QUnit.test('Case 1. :has performance', function (assert) {
      var selectorText = '.container #case1 div div:has(.banner)';
      var selector = ExtendedSelectorFactory.createSelector(selectorText);
      performanceTest(selector, assert);
    });
    QUnit.test('Case 2. :contains performance', function (assert) {
      var selectorText = '.container #case2 div div:contains(Block this)';
      var selector = ExtendedSelectorFactory.createSelector(selectorText);
      performanceTest(selector, assert);
    });
    QUnit.test('Case 3. :matches-css performance', function (assert) {
      var selectorText = '.container #case3 div div:matches-css(background-image: data:*)';
      var selector = ExtendedSelectorFactory.createSelector(selectorText);
      performanceTest(selector, assert);
    });
    QUnit.test('Case 4. :has and :contains composite performance', function (assert) {
      var selectorText = '.container #case4 div div:has(.banner:contains(Block this))';
      var selector = ExtendedSelectorFactory.createSelector(selectorText);
      performanceTest(selector, assert);
    });
    QUnit.test('Case 5.1 complicated selector', function (assert) {
      // https://github.com/AdguardTeam/ExtendedCss/issues/25
      var selectorText = "#case5 > div:not([style^=\"min-height:\"]) > div[id][data-uniqid^=\"toolkit-\"]:not([data-bem]):not([data-mnemo])[-ext-has='a[href^=\"https://an.yandex.\"]>img']";
      var selector = ExtendedSelectorFactory.createSelector(selectorText);
      performanceTest(selector, assert);
    }); // Previous test results: Average: 0.0665 ms -> Last test results Average: 0.0409 ms

    QUnit.test('Case 5.2 split selectors with a lot of children', function (assert) {
      var selectorText = '#case5 div > div:has(.target-banner)';
      var selector = ExtendedSelectorFactory.createSelector(selectorText);
      performanceTest(selector, assert);
    }); // Prev test results: Average: 0.1101 ms -> Last test results Average: 0.0601 ms

    QUnit.test('Case 5.3 split selectors with a lot of children and matches-css', function (assert) {
      var selectorText = '#case5 div > div:matches-css(background-image: data:*)';
      var selector = ExtendedSelectorFactory.createSelector(selectorText);
      performanceTest(selector, assert);
    });

}());
