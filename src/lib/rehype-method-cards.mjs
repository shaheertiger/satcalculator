// Styles the per-method evaluation blocks that every guide writes in plain markdown:
//
//   **良い点**            -> <p class="pc-title pc-pros">  + next <ul class="pc-list pc-pros">
//   **注意点**            -> <p class="pc-title pc-cons">  + next <ul class="pc-list pc-cons">
//   **判定：** text…      -> <p class="method-verdict">
const text = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));
const isEl = (n, tag) => n && n.type === 'element' && n.tagName === tag;
const addClass = (n, ...c) => {
  const cur = n.properties.className ?? [];
  n.properties.className = [...(Array.isArray(cur) ? cur : [cur]), ...c];
};

export default function rehypeMethodCards() {
  return (tree) => {
    const walk = (parent) => {
      const kids = parent.children ?? [];
      kids.forEach((node, i) => {
        if (!isEl(node, 'p')) return walk(node);
        const real = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
        const first = real[0];
        if (!isEl(first, 'strong')) return;
        const label = text(first).trim();
        const kind = label === '良い点' ? 'pc-pros' : label === '注意点' ? 'pc-cons' : null;
        if (kind && real.length === 1) {
          addClass(node, 'pc-title', kind);
          const next = kids.slice(i + 1).find((c) => c.type === 'element');
          if (isEl(next, 'ul')) addClass(next, 'pc-list', kind);
        } else if (/^判定[：:]/.test(label)) {
          addClass(node, 'method-verdict');
        }
      });
    };
    walk(tree);
  };
}
