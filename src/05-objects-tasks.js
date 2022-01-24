/* eslint-disable max-classes-per-file */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class SelectorCombinator {
  constructor(selector1, selector2, combinator) {
    this.selector1 = selector1;
    this.selector2 = selector2;
    this.combinator = combinator;
  }

  stringify() {
    return `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
  }
}

class SelectorClass {
  constructor() {
    this.elementValue = '';
    this.idValue = '';
    this.attrValue = '';
    this.pseudoElementValue = '';

    this.classes = '';
    this.pseudoClasses = '';

    this.combines = [];
  }

  element(value) {
    if (this.elementValue) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.idValue) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.elementValue = value;
    return this;
  }

  id(value) {
    if (this.idValue) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.classes) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoElementValue) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.idValue = `#${value}`;
    return this;
  }

  class(value) {
    if (this.attrValue) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.classes += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.pseudoClasses) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.attrValue = `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElementValue) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.pseudoClasses += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementValue) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElementValue += `::${value}`;
    return this;
  }

  stringify() {
    return `${this.elementValue}${this.idValue}${this.classes}${this.attrValue}${this.pseudoClasses}${this.pseudoElementValue}`;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const selector = new SelectorClass();
    return selector.element(value);
  },

  id(value) {
    const selector = new SelectorClass();
    return selector.id(value);
  },

  class(value) {
    const selector = new SelectorClass();
    return selector.class(value);
  },

  attr(value) {
    const selector = new SelectorClass();
    return selector.attr(value);
  },

  pseudoClass(value) {
    const selector = new SelectorClass();
    return selector.pseudoClass(value);
  },

  pseudoElement(value) {
    const selector = new SelectorClass();
    return selector.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const comb = new SelectorCombinator(selector1, selector2, combinator);
    return comb;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
