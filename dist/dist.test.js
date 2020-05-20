(function () {
    'use strict';

    /* global QUnit, ExtendedCss */

    /* Start with creating ExtendedCss */
    var cssText = document.getElementById('extendedCss').innerHTML;
    var extCss = new ExtendedCss({
      styleSheet: cssText
    });
    extCss.apply();
    /**
     * Asserts that specified function has specified expected styles
     */

    var assertElementStyle = function assertElementStyle(id, expectedStyle, assert) {
      var element = document.getElementById(id);
      var resultOk = true;

      if (!element) {
        resultOk = false;
      }

      Object.keys(expectedStyle).forEach(function (prop) {
        var left = element.style.getPropertyValue(prop) || '';
        var right = expectedStyle[prop];

        if (left !== right) {
          resultOk = false;
        }
      });
      assert.ok(resultOk, id + (resultOk ? ' ok' : ' element either does not exist or has different style.'));
    };
    /**
     * We throttle MO callbacks in ExtCss with requestAnimationFrame and setTimeout.
     * Browsers postpone rAF callbacks in inactive tabs for a long time.
     * It throttles setTimeout callbacks as well, but it is called within a
     * relatively short time. (within several seconds)
     * We apply rAF in tests as well to postpone test for similar amount of time.
     */


    var rAF = function rAF(fn, timeout) {
      if (window.requestAnimationFrame) {
        requestAnimationFrame(function () {
          setTimeout(fn, timeout);
        });
      } else {
        setTimeout(fn, timeout);
      }
    };

    QUnit.test('Modifer -ext-has', function (assert) {
      assertElementStyle('case1-blocked', {
        display: 'none'
      }, assert);
    });
    QUnit.test('Append our style', function (assert) {
      assertElementStyle('case3-modified', {
        'display': 'block',
        'visibility': 'hidden'
      }, assert);
    });
    QUnit.test('Composite style', function (assert) {
      assertElementStyle('case4-blocked', {
        'display': 'none'
      }, assert);
      assertElementStyle('case4-notblocked', {
        'display': ''
      }, assert);
    });
    QUnit.test('Reaction on DOM modification', function (assert) {
      var done = assert.async();
      assertElementStyle('case5-blocked', {
        display: 'none'
      }, assert);
      var el = document.getElementById('case5-blocked');
      document.getElementById('container').appendChild(el);
      rAF(function () {
        assertElementStyle('case5-blocked', {
          display: ''
        }, assert);
        done();
      }, 200);
    });
    QUnit.test('Protection from recurring style fixes', function (assert) {
      var done = assert.async();
      var testNode = document.getElementById('case11');
      var styleTamperCount = 0;

      var tamperStyle = function tamperStyle() {
        if (testNode.hasAttribute('style')) {
          testNode.removeAttribute('style');
          styleTamperCount++;
        }
      };

      var tamperObserver = new MutationObserver(tamperStyle);
      tamperStyle();
      tamperObserver.observe(testNode, {
        attributes: true,
        attributeFilter: ['style']
      });
      setTimeout(function () {
        tamperObserver.disconnect();
        assert.ok(styleTamperCount < 60);
        assert.ok(styleTamperCount >= 50);
        assert.notOk(testNode.hasAttribute('style'));
        done();
      }, 1000);
    });

}());
