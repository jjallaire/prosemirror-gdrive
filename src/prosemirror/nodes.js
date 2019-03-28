

import { schema } from "prosemirror-schema-basic"

import { addListNodes } from "prosemirror-schema-list"

import { imageNode } from './image/node.js'

export function buildNodes(extra = {}) {

  // add list nodes to standard schema
   // schema.spec.ndoes is an OrderedMap (https://github.com/marijnh/orderedmap)
  let schemaNodes = addListNodes(schema.spec.nodes, "paragraph block*", "block")

  // additional nodes 
  let nodes = {
    image: imageNode,
    ...extra,
  }

 

  // add the nodes
  return Object.keys(nodes).reduce((schemaNodes, node) => {
    return schemaNodes.update(node, nodes[node]);
  }, schemaNodes);
}