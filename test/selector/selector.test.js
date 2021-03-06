/**
 * Copyright 2016 Performix LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable max-len */
/* global QUnit */

const { ExtendedSelectorFactory } = exports;

QUnit.test('Test ExtendedSelector', (assert) => {
    const checkElements = function (elements, selector) {
        for (let i = 0; i < elements.length; i++) {
            assert.ok(selector.matches(elements[i]));
        }
    };

    let elements;
    let selector;

    selector = ExtendedSelectorFactory.createSelector('div a[-ext-contains="adg-test"]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selector = ExtendedSelectorFactory.createSelector('div.test-class[-ext-has="time.g-time"]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selector = ExtendedSelectorFactory.createSelector('div#test-div[-ext-has="test"]');
    elements = selector.querySelectorAll();
    assert.equal(0, elements.length);

    elements = ExtendedSelectorFactory.createSelector('[-ext-has="div.advert"]').querySelectorAll();
    assert.equal(0, elements.length);

    selector = ExtendedSelectorFactory.createSelector('[-ext-has="div.test-class-two"]');
    elements = selector.querySelectorAll();

    assert.equal(5, elements.length);
    checkElements(elements, selector);

    selector = ExtendedSelectorFactory.createSelector('div[-ext-contains="adg-test"][-ext-has="div.test-class-two"]');
    elements = selector.querySelectorAll();
    assert.equal(3, elements.length);
    checkElements(elements, selector);

    selector = ExtendedSelectorFactory.createSelector('div[-ext-contains="adg-test"][-ext-has="div.test-class-two"][i18n]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    checkElements(elements, selector);

    selector = ExtendedSelectorFactory.createSelector('div[-ext-has="div.test-class-two"]');
    elements = selector.querySelectorAll();
    assert.equal(3, elements.length);
    checkElements(elements, selector);

    selector = ExtendedSelectorFactory.createSelector('div[-ext-has="div.test-class-two"] > .test-class[-ext-contains="adg-test"]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    checkElements(elements, selector);
});

QUnit.test('Test -ext-matches-css', (assert) => {
    // Compatible syntax
    let selector = ExtendedSelectorFactory.createSelector('#test-matches-css div[-ext-matches-css="background-image: url(data:*)"]');
    let elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-div-background'));

    // Standard syntax
    selector = ExtendedSelectorFactory.createSelector('#test-matches-css div:matches-css(background-image: url(data:*))');
    elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-div-background'));
});

QUnit.test('Test -ext-matches-css with opacity property', (assert) => {
    // Compatible syntax
    let selector = ExtendedSelectorFactory.createSelector('#test-opacity-property[-ext-matches-css="opacity: 0.9"]');
    let elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-opacity-property'));

    // Standard syntax
    selector = ExtendedSelectorFactory.createSelector('#test-opacity-property:matches-css(opacity: 0.9)');
    elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-opacity-property'));
});

QUnit.test('Test -ext-matches-css-before', (assert) => {
    // Compatible syntax
    let selector = ExtendedSelectorFactory.createSelector('#test-matches-css div[-ext-matches-css-before="content: *find me*"]');
    let elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-div-before'));

    // Standard syntax
    selector = ExtendedSelectorFactory.createSelector('#test-matches-css div:matches-css-before(content: *find me*)');
    elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-div-before'));
});

QUnit.test('Test -ext-matches-css-after', (assert) => {
    // Compatible syntax
    let selector = ExtendedSelectorFactory.createSelector('#test-matches-css div[-ext-matches-css-after="content: *find me*"]');
    let elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-div-after'));

    // Standard syntax
    selector = ExtendedSelectorFactory.createSelector('#test-matches-css div:matches-css-after(content: *find me*)');
    elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById('test-div-after'));
});

QUnit.test('Test tokenize selector', (assert) => {
    let selectorText = '#test';
    let compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.notOk(compiled.simple);
    assert.notOk(compiled.relation);
    assert.notOk(compiled.complex);

    selectorText = "div span.className > a[href^='http'] > #banner";
    compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.notOk(compiled.simple);
    assert.notOk(compiled.relation);
    assert.notOk(compiled.complex);

    selectorText = "div span.className + a[href^='http'] ~ #banner";
    compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.notOk(compiled.simple);
    assert.notOk(compiled.relation);
    assert.notOk(compiled.complex);

    selectorText = '#banner div:first-child > div:has(.banner)';
    compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.equal(compiled.simple, '#banner div:first-child');
    assert.equal(compiled.relation, '>');
    assert.equal(compiled.complex, 'div:has(.banner)');

    selectorText = '#banner div:first-child ~ div:has(.banner)';
    compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.equal(compiled.simple, '#banner div:first-child');
    assert.equal(compiled.relation, '~');
    assert.equal(compiled.complex, 'div:has(.banner)');

    selectorText = '#banner div:first-child > div > :has(.banner) > div';
    compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.notEqual(compiled.constructor.name, 'SplittedSelector');
    assert.equal(compiled.selectorText, selectorText);

    selectorText = '#banner div:first-child > div + :has(.banner) > div';
    compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.notEqual(compiled.constructor.name, 'SplittedSelector');
    assert.equal(compiled.selectorText, selectorText);

    selectorText = '#banner :not(div) div:matches-css(background: blank)';
    compiled = ExtendedSelectorFactory.createSelector(selectorText);
    assert.equal(compiled.simple, '#banner :not(div)');
    assert.equal(compiled.relation, ' ');
    assert.equal(compiled.complex, 'div:matches-css(background: blank)');
});

QUnit.test('Test regular expressions support in :contains', (assert) => {
    const selectorText = '*[-ext-contains=\'/\\s[a-t]{8}$/\'] + *:contains(/^[^\\"\\\'"]{30}quickly/)';
    const selector = ExtendedSelectorFactory.createSelector(selectorText);
    const elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
});

QUnit.test('Test regular expressions flags support in :contains', (assert) => {
    let elements;
    let selector;
    let selectorText;

    selectorText = 'p:contains(/Quickly/)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(0, elements.length);

    selectorText = 'p:contains(/quickly/)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);

    selectorText = 'p:contains(/Quickly/i)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);

    selectorText = 'p:contains(/Quickly/gmi)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
});

QUnit.test('Test regular expressions support in :matches-css', (assert) => {
    // var selectorText = ':matches-css(    background-image: /^url\\((.)[a-z]{4}:[a-z]{2}\\1nk\\)$/    ) + [-ext-matches-css-before=\'content:  /^[A-Z][a-z]{2}\\s/  \'][-ext-has=\'+:matches-css-after( content  :   /(\\d+\\s)*me/  ):contains(/^(?![\\s\\S])/)\']';
    const selectorText = ':matches-css(    background-image: /^url\\([a-z]{4}:[a-z]{5}\\/[gif;base].*\\)$/    ) + [-ext-matches-css-before=\'content:  /^[A-Z][a-z]{2}\\s/  \'][-ext-has=\'+:matches-css-after( content  :   /(\\d+\\s)*me/  ):contains(/^(?![\\s\\S])/)\']';
    const selector = ExtendedSelectorFactory.createSelector(selectorText);
    const elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
});

QUnit.test('Test simple regex support in :matches-css, when ()[] characters are escaped', (assert) => {
    const selectorText = ':matches-css(background-image:url\(data:*\))';
    const selector = ExtendedSelectorFactory.createSelector(selectorText);
    const elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
});

QUnit.test('Test -abp-has and -abp-has-text', (assert) => {
    let elements;
    let selector;

    selector = ExtendedSelectorFactory.createSelector('div.test-class:-abp-has(time.g-time)');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selector = ExtendedSelectorFactory.createSelector('div:-abp-has(div.test-class-two) > .test-class:-abp-contains(adg-test)');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
});

QUnit.test('Test if and if-not', (assert) => {
    let elements;
    let selector;

    selector = ExtendedSelectorFactory.createSelector('div.test-class:if(time.g-time)');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selector = ExtendedSelectorFactory.createSelector('#test-if-not > *:if-not(> .test-class)');
    elements = selector.querySelectorAll();
    assert.equal(2, elements.length);
    assert.ok(selector.matches(elements[0]));
});

QUnit.test('Test + and ~ combinators matching', (assert) => {
    let selectorText; let selector; let
        elements;

    selectorText = "* > p ~ #test-id-div a:contains('adg-test')";
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selectorText = '* > div + style:matches-css(display:none) ~ div > *:matches-css-after(content:/y\\st/)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selectorText = "* > .lead ~ div:has(a[href^='/t'])";
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selectorText = "* > .lead + div:has(a[href^='/t'])";
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
});

QUnit.test('Test xpath / nth-ancestor / upward', (assert) => {
    let selectorText; let selector; let elements;

    selectorText = 'div:xpath(//*[@class="test-xpath-class"])';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-xpath-class-div', elements[0].id);

    selectorText = 'div:xpath(//*[@class="test-xpath-div-inner-class"]/../..)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-xpath-div', elements[0].id);

    selectorText = ':xpath(//div[contains(text(),"test-xpath-content")]/../..)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-xpath-content-div', elements[0].id);

    selectorText = '.test-xpath-div-inner-class:xpath(../../..)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-xpath', elements[0].id);

    selectorText = '.test-xpath-content-class:has-text(/test-xpath-content/):xpath(../../..)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-xpath', elements[0].id);

    selectorText = 'div:has-text(/test-xpath-content/):xpath(../../..)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(5, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.ok(selector.matches(elements[1]));
    assert.ok(selector.matches(elements[2]));
    assert.equal('test-xpath', elements[4].id);

    selectorText = 'div.test-nth-ancestor-marker:nth-ancestor(4)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(2, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.ok(selector.matches(elements[1]));
    assert.equal('test-nth-ancestor-div', elements[0].id);

    selectorText = 'div.test-upward-marker:upward(2)';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(2, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.ok(selector.matches(elements[1]));
    assert.equal('test-upward-div', elements[0].id);

    selectorText = '.test-upward-selector:upward(div[id])';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-upward-div', elements[0].id);

    selectorText = '.test-upward-selector:upward(div[class^="test-upward-"])';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-upward-marker', elements[0].className);

    selectorText = 'div:contains(upward contains):upward(div[id][class])';
    selector = ExtendedSelectorFactory.createSelector(selectorText);
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));
    assert.equal('test-upward-div', elements[0].id);
});

QUnit.test('Test xpath validation', (assert) => {
    let selectorText;

    try {
        selectorText = 'div:xpath()';
        ExtendedSelectorFactory.createSelector(selectorText);
        assert.ok(false);
    } catch (e) {
        assert.ok(e);
    }

    try {
        selectorText = 'div:xpath(../..):has-text(/test-xpath-content/)';
        ExtendedSelectorFactory.createSelector(selectorText);
        assert.ok(false);
    } catch (e) {
        assert.ok(e);
    }

    try {
        selectorText = 'div:nth-ancestor(invalid)';
        ExtendedSelectorFactory.createSelector(selectorText);
        assert.ok(false);
    } catch (e) {
        assert.ok(e);
    }

    try {
        selectorText = 'div:nth-ancestor(2):has-text(/test-xpath-content/)';
        ExtendedSelectorFactory.createSelector(selectorText);
        assert.ok(false);
    } catch (e) {
        assert.ok(e);
    }

    try {
        selectorText = 'div:upward()';
        ExtendedSelectorFactory.createSelector(selectorText);
        assert.ok(false);
    } catch (e) {
        assert.ok(e);
    }
    try {
        selectorText = 'div:upward(selector)';
        ExtendedSelectorFactory.createSelector(selectorText);
        assert.ok(true);
    } catch (e) {
        assert.ok(e);
    }

    try {
        selectorText = 'div:upward(3):has-text(/test-xpath-content/)';
        ExtendedSelectorFactory.createSelector(selectorText);
        assert.ok(false);
    } catch (e) {
        assert.ok(e);
    }
});
