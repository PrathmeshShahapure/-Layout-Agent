export function findNodeByTarget(layout, target) {

    const nodes = Object.values(layout.nodes);
  
    target = target.toLowerCase();
  
    return nodes.find((node) => {
  
      const name =
        node.name?.toLowerCase() || "";
  
      const content =
        node.data?.content?.toLowerCase() || "";
  
      return (
        name.includes(target) ||
        content.includes(target)
      );
    });
  }
  
  export function applyUpdates(node, updates) {
  
    Object.keys(updates).forEach((key) => {
      node[key] = updates[key];
    });
  
    return node;
  }