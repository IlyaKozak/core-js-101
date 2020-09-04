/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
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
  this.getArea = function getArea() {
    return this.width * this.height;
  };
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
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
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

const cssSelectorBuilder = {
  errors: [
    'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    'Element, id and pseudo-element should not occur more then one time inside the selector',
  ],
  selector: '',
  element: function element(value) {
    this.error(1);
    const self = Object.create(cssSelectorBuilder);
    self.priority = 1;
    self.selector = `${this.selector}${value}`;
    return self;
  },
  id: function id(value) {
    this.error(2);
    const self = Object.create(cssSelectorBuilder);
    self.priority = 2;
    self.selector = `${this.selector}#${value}`;
    return self;
  },
  class: function cls(value) {
    this.error(3);
    const self = Object.create(cssSelectorBuilder);
    self.priority = 3;
    self.selector = `${this.selector}.${value}`;
    return self;
  },
  attr: function attr(value) {
    this.error(4);
    const self = Object.create(cssSelectorBuilder);
    self.priority = 4;
    self.selector = `${this.selector}[${value}]`;
    return self;
  },
  pseudoClass: function pseudoClass(value) {
    this.error(5);
    const self = Object.create(cssSelectorBuilder);
    self.priority = 5;
    self.selector = `${this.selector}:${value}`;
    return self;
  },
  pseudoElement: function pseudoElement(value) {
    this.error(6);
    const self = Object.create(cssSelectorBuilder);
    self.priority = 6;
    self.selector = `${this.selector}::${value}`;
    return self;
  },
  combine: function combine(selector1, combinator, selector2) {
    const self = Object.create(cssSelectorBuilder);
    self.selector = `${selector1.selector} ${combinator} ${selector2.selector}`;
    return self;
  },
  stringify: function stringify() {
    return this.selector;
  },
  error: function error(priority) {
    if (this.priority > priority) {
      throw new Error(this.errors[0]);
    }
    const check1 = this.priority === priority;
    const check2 = priority === 1 || priority === 2 || priority === 6;
    if (check1 && check2) {
      throw new Error(this.errors[1]);
    }
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
