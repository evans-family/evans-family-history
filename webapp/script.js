async function loadData() {
  const response = await fetch('../data/balkan_familytree.json');
  return await response.json();
}

function searchNodes(nodes, query) {
  const q = query.toLowerCase();
  return nodes.filter(n => n.name && n.name.toLowerCase().includes(q));
}

let allNodes = [];
let currentRootId = null;
let currentSpouseIndex = 0;

function updateSpouseToggle(rootNode) {
  const select = document.getElementById('spouseSelect');
  const label = document.getElementById('spouseLabel');
  select.innerHTML = '';

  if (rootNode && rootNode.pids && rootNode.pids.length > 1) {
    rootNode.pids.forEach((id, idx) => {
      const spouse = allNodes.find(n => n.id === id);
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = spouse ? spouse.name : id;
      select.appendChild(opt);
    });
    label.style.display = 'inline';
    select.value = currentSpouseIndex;
    select.onchange = () => {
      currentSpouseIndex = parseInt(select.value, 10);
      renderTree(allNodes, currentRootId, currentSpouseIndex);
    };
  } else {
    label.style.display = 'none';
  }
}

function renderTree(nodesData, rootId, spouseIndex = 0) {
  document.getElementById('tree').innerHTML = '';
  currentRootId = rootId;
  currentSpouseIndex = spouseIndex;
  allNodes = nodesData;

  const displayNodes = allNodes.map(n => ({ ...n }));
  const rootNode = displayNodes.find(n => n.id === rootId);
  updateSpouseToggle(rootNode);

  if (rootNode && rootNode.pids && rootNode.pids.length > 1) {
    rootNode.pids = [rootNode.pids[spouseIndex]];
  }

  new FamilyTree(document.getElementById('tree'), {
    template: 'john',
    nodeBinding: { field_0: 'name' },
    nodes: displayNodes,
    roots: [rootId]
  });
}

async function main() {
  const nodesData = await loadData();
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');

  const defaultId = nodesData[0].id;
  renderTree(nodesData, defaultId);

  searchBtn.onclick = () => {
    const results = searchNodes(nodesData, searchInput.value);
    resultsDiv.innerHTML = '';
    if (results.length === 0) {
      resultsDiv.textContent = 'No matches found.';
      return;
    }
    results.forEach(r => {
      const btn = document.createElement('button');
      btn.textContent = r.name;
      btn.onclick = () => renderTree(nodesData, r.id);
      resultsDiv.appendChild(btn);
    });
  };
}

main();
