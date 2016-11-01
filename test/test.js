const jsdom = require("jsdom");
const document = jsdom.jsdom("");
var assert = require("assert");
const dom = require("../src/index");
import 'babel-polyfill'

describe('_parseSpec', function() {
  context('with a text spec', function() {
    it('parses correctly', function() {
      const spec = "foo";
      const results = dom._parseSpec(spec);

      assert.equal(results.type, "text");
      assert.equal(results.text, "foo");
    });
  });

  context('with a number spec', function() {
    it('parses correctly', function() {
      const spec = 42;
      const results = dom._parseSpec(spec);

      assert.equal(results.type, "text");
      assert.equal(results.text, "42");
    });
  });

  context('with an element spec', function() {
    context('with attrs', function() {
      context('with no children', function() {
        it('parses correctly', function() {
          const attrs = {"class": "foo"}
          const spec = ["html", attrs]
          const results = dom._parseSpec(spec);

          assert.equal(results.tag, "html");
          assert.deepEqual(results.attrs, Object.entries(attrs));
          assert.deepEqual(results.children, []);
        });
      });

      context('with one child', function() {
        it('parses correctly', function() {
          const attrs = {"class": "foo"}
          const child = ["body", {"class": "bar"}, "Test"]
          const spec = ["html", attrs, child]
          const results = dom._parseSpec(spec);

          assert.equal(results.tag, "html");
          assert.deepEqual(results.attrs, Object.entries(attrs));
          assert.deepEqual(results.children, [child].map(c => dom._parseSpec(c)));
        });
      });

      context('with many children', function() {
        it('parses correctly', function() {
          const attrs = {"class": "foo"}
          const child = ["p", {"class": "bar"}, "Test"]
          const spec = ["html", attrs, child, child]
          const results = dom._parseSpec(spec);

          assert.equal(results.tag, "html");
          assert.deepEqual(results.attrs, Object.entries(attrs));
          assert.deepEqual(results.children, [child, child].map(c => dom._parseSpec(c)));
        });
      });
    });

    context('without attrs', function() {
      context('with no children', function() {
        it('parses correctly', function() {
          const spec = ["html"]
          const results = dom._parseSpec(spec);

          assert.equal(results.tag, "html");
          assert.deepEqual(results.attrs, {});
          assert.deepEqual(results.children, []);
        });
      });

      context('with one child', function() {
        it('parses correctly', function() {
          const child = ["body", {"class": "bar"}, "Test"]
          const spec = ["html", child]
          const results = dom._parseSpec(spec);

          assert.equal(results.tag, "html");
          assert.deepEqual(results.attrs, {});
          assert.deepEqual(results.children, [child].map(c => dom._parseSpec(c)));
        });
      });

      context('with many children', function() {
        it('parses correctly', function() {
          const child = ["p", {"class": "bar"}, "Test"]
          const spec = ["html", child, child]
          const results = dom._parseSpec(spec);

          assert.equal(results.tag, "html");
          assert.deepEqual(results.attrs, {});
          assert.deepEqual(results.children, [child, child].map(c => dom._parseSpec(c)));
        });
      });
    });
  });
});

describe('element', function() {
  it('passes smoke test', function() {
    const content = ["html",
                      ["body", {"class": "thing"},
                        ["h1", {"style": "font-weight: bold;"},
                          "Hello world!",
                          "Goodybe world!"],
                        ["p", "This is my treatise on the dark injustices of our times."]
                      ]
                    ]
    const result = dom.element(document, dom._parseSpec(content));
    assert.ok(result);
    console.log(result.toString());
  });
});
