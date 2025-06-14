async function loadData() {
  const response = await fetch('../data/balkan_familytree.json');
  return await response.json();
}

function searchNodes(nodes, query) {
  const q = query.toLowerCase();
  return nodes.filter(n => n.name && n.name.toLowerCase().includes(q));
}

function renderTree(nodes, rootId) {
  document.getElementById('tree').innerHTML = '';
  new FamilyTree(document.getElementById('tree'), {
    template: 'john',
    nodeBinding: { field_0: 'name' },
    nodes,
    roots: [rootId],
    scaleInitial: 1,
    scaleMin: 0.02,
    enablePan: true,
    mouseScrool: FamilyTree.action.zoom
  });
}

async function main() {
  const nodes = await loadData();
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');

  const defaultId = nodes[0].id;
  renderTree(nodes, defaultId);

  searchBtn.onclick = () => {
    const results = searchNodes(nodes, searchInput.value);
    resultsDiv.innerHTML = '';
    if (results.length === 0) {
      resultsDiv.textContent = 'No matches found.';
      return;
    }
    results.forEach(r => {
      const btn = document.createElement('button');
      btn.textContent = r.name;
      btn.onclick = () => renderTree(nodes, r.id);
      resultsDiv.appendChild(btn);
    });
  };
}

main();
