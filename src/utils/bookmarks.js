/**
 * Count bookmarks and folders from bookmark tree nodes.
 */
export function countBookmarks(nodes) {
  let bookmarks = 0;
  let folders = 0;

  const traverse = (node) => {
    if (node.children) {
      folders++;
      node.children.forEach(traverse);
    } else if (node.url) {
      bookmarks++;
    }
  };

  nodes.forEach(traverse);
  return { bookmarks, folders };
}

/**
 * Flatten bookmark tree to array of { id, title, url, parentId }.
 */
export function flattenBookmarks(nodes, result = []) {
  nodes.forEach((node) => {
    if (node.children) {
      flattenBookmarks(node.children, result);
    } else if (node.url) {
      result.push({
        id: node.id,
        title: node.title,
        url: node.url,
        parentId: node.parentId,
      });
    }
  });
  return result;
}
