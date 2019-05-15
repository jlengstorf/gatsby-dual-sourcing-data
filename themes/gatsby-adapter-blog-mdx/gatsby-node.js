exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === 'Mdx') {
    const parent = getNode(node.parent);
    actions.createNodeField({
      node,
      name: 'sourceInstanceName',
      value: parent.sourceInstanceName,
    });
  }
};
