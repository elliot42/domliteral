# domliteral

Create DOM nodes from plain JS data literals

## Getting Started

```bash
npm install domliteral
```

In your script:

```javascript
const dom = require("domliteral");

// exposes two functions:
dom.parse("hello"))   // returns a parse tree, mostly just for headless testing
dom.element("hello") // returns an actual DOM element, if you're in a browser context

// common use
const elem = dom.element(["div", {"class": "foo"}, "hello"])
document.appendChild(elem);
```

## Examples

```javascript

// simple literals
dom.parse("hello") // => TextNode "hello"
dom.parse(42)      // => TextNode "42"

// tagged elements are represented as arrays,
// where the second selement is optionally
// an object of attributes
dom.parse(["p"])                   // => <p></p>
dom.parse(["p", {"class": "foo"}]  // => <p class="foo"></p>

// children are any literals that occur after the tag and (optional) attrs.
dom.parse(
  ["ul",
    ["li", {"class": "foo"},
      "hello"]])
// => <ul><li class="bar">hello</li></ul>

// everything else works like normal, including variables and event handlers
function button(label, alertText) {
  return ["button", {onClick: function(event) { alert(alertText); }}, alertText];
}
```
