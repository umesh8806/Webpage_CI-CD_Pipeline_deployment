// js/replace-ap.js
// Replaces standalone text "AP" with "UB" in all visible text nodes.
// Skips script/style/input/textarea/code/pre to avoid breaking markup.
document.addEventListener('DOMContentLoaded', () => {
  const SKIP = new Set(['SCRIPT','STYLE','INPUT','TEXTAREA','CODE','PRE','NOSCRIPT']);
  const walk = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.parentElement || SKIP.has(node.parentElement.tagName))
          return NodeFilter.FILTER_REJECT;
        return /\bAP\b/.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      }
    }
  );
  let node;
  while ((node = walk.nextNode())) {
    node.nodeValue = node.nodeValue.replace(/\bAP\b/g, 'UB');
  }
});
