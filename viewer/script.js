let nodes = [];

async function loadData() {
  const res = await fetch('../data/balkan_familytree.json');
  nodes = await res.json();
}

function findMatches(query) {
  const q = query.toLowerCase();
  return nodes.filter(n => n.name && n.name.toLowerCase().includes(q));
}

function getById(id) {
  return nodes.find(n => n.id === id);
}

function getChildren(id) {
  return nodes.filter(n => n.fid === id || n.mid === id);
}

function showDetails(person) {
  const container = document.getElementById('details');
  container.innerHTML = '';
  if (!person) {
    container.textContent = 'No person selected.';
    return;
  }
  const father = getById(person.fid);
  const mother = getById(person.mid);
  const spouses = (person.pids || []).map(getById);
  const children = getChildren(person.id);
  container.innerHTML = `
    <h2>${person.name}</h2>
    <p><strong>Father:</strong> ${father ? father.name : 'Unknown'}</p>
    <p><strong>Mother:</strong> ${mother ? mother.name : 'Unknown'}</p>
    <p><strong>Spouse(s):</strong> ${spouses.map(s => s.name).join(', ') || 'None'}</p>
    <p><strong>Children:</strong> ${children.map(c => c.name).join(', ') || 'None'}</p>
  `;
}

function setup() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');

  searchBtn.onclick = () => {
    resultsDiv.innerHTML = '';
    const matches = findMatches(searchInput.value);
    if (matches.length === 0) {
      resultsDiv.textContent = 'No matches found.';
      return;
    }
    matches.forEach(p => {
      const btn = document.createElement('button');
      btn.textContent = p.name;
      btn.onclick = () => showDetails(p);
      resultsDiv.appendChild(btn);
    });
  };
}

loadData().then(setup);
