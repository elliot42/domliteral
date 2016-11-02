"use strict";

// Given a tag spec, parse into a { type, tag, attrs, children }
//
// tag:
//   - with attrs: [tag, attrs, ...children]
//   - without attrs: [tag, ...children]
//   - where:
//     - tag is a string
//     - attrs is a JS object {} of key/value pairs
//       - (use string keys for reserved words, like "class")
//     - children are each themselves specs, recursively.
function _parseElement(tag, ...rest) {
  const type = "element";
  const head = rest[0]
  const hasAttrs = (head && head.constructor == Object)
  const attrs = hasAttrs ? head : {};
  const children_raw = hasAttrs ? rest.slice(1) : rest;
  const children = children_raw.map(child => parse(child));
  return { type, tag, attrs, children }
}


// Given a spec, parse into a { type, tag, attrs, children }
//
// Spec may be of the form:
// text: "text"
// number: 42
// tag:
//   - with attrs: [tag, attrs, ...children]
//   - without attrs: [tag, ...children]
//   - where:
//     - tag is a string
//     - attrs is a JS object {} of key/value pairs
//       - (use string keys for reserved words, like "class")
//     - children are each themselves specs, recursively.
function parse(spec) {
  switch(typeof spec) {
    case "string":
      return {
        type: "text",
        text: spec.toString()
      }
    case "number":
      return {
        type: "text",
        text: spec.toString()
      }
    default:
      return _parseElement(...spec);
  }
}

function _elementFromElementNode(document, elementNode) {
  const {tag, attrs, children} = elementNode;
	const elem = document.createElement(tag);

  for (let k of Object.keys(attrs)) {
    elem.setAttribute(k, attrs[k]);
  }

	for (let childNode of children) {
		elem.appendChild(_element(document, childNode));
	}
	return elem;
}

function _element(document, parsedNode) {
  switch(parsedNode.type) {
    case "text":
      return document.createTextNode(parsedNode.text);
    case "element":
      return _elementFromElementNode(document, parsedNode);
  }
}

function element(spec) {
  return _element(document, parse(spec));
}

exports.parse = parse;
exports._element = _element;
exports.element = element;
