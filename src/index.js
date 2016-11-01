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
function _parseElementSpec(tag, ...rest) {
  const type = "element";
  const head = rest[0]
  const hasAttrs = (head && head.constructor == Object)
  const attrs = Object.entries(hasAttrs ? head : {});
  const children_raw = hasAttrs ? rest.slice(1) : rest;
  const children = children_raw.map(child => _parseSpec(child));
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
function _parseSpec(spec) {
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
      return _parseElementSpec(...spec);
  }
}

function elementFromElementNode(document, elementNode) {
  const {tag, attrs, children} = elementNode;
	const elem = document.createElement(tag);

  for (let kv of attrs) {
		elem.setAttribute(...kv);
  }

	for (let childNode of children) {
		elem.appendChild(element(document, childNode));
	}
	return elem;
}

function element(document, parsedNode) {
  switch(parsedNode.type) {
    case "text":
      return document.createTextNode(parsedNode.text);
    case "element":
      return elementFromElementNode(document, parsedNode);
  }
}

exports._parseSpec = _parseSpec;
exports.element = element;
