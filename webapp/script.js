async function loadData() {
  const response = await fetch('../data/EvansFamilyTree.json');
  const data = await response.json();
  const persons = data.persons;
  const families = data.families;
  return { persons, families };
}

function searchPersons(persons, query) {
  const q = query.toLowerCase();
  return Object.entries(persons)
    .filter(([id, p]) => p.NAME && p.NAME.TEXT && p.NAME.TEXT.toLowerCase().includes(q))
    .map(([id, p]) => ({ id, name: p.NAME.TEXT.replace(/\//g, '') }));
}

function getPersonName(person) {
  if (!person || !person.NAME) return 'Unknown';
  return person.NAME.TEXT.replace(/\//g, '');
}

function buildTreeData(persons, families, personId) {
  const person = persons[personId];
  if (!person) return null;
  const node = { name: getPersonName(person), children: [] };
  // parents
  if (person.FAMC) {
    const fam = families[person.FAMC];
    if (fam) {
      const father = persons[fam.HUSB?.PERSON];
      const mother = persons[fam.WIFE?.PERSON];
      if (father) node.children.push({ name: getPersonName(father) + ' (father)' });
      if (mother) node.children.push({ name: getPersonName(mother) + ' (mother)' });
    }
  }
  // children
  if (person.FAMS) {
    const famId = person.FAMS;
    const fam = families[famId];
    if (fam && fam.CHIL) {
      const kids = Array.isArray(fam.CHIL) ? fam.CHIL : [fam.CHIL];
      kids.forEach(k => {
        const child = persons[k.PERSON || k];
        if (child) node.children.push({ name: getPersonName(child) + ' (child)' });
      });
    }
  }
  return node;
}

function renderTree(data) {
  const svg = d3.select('#tree');
  svg.selectAll('*').remove();
  const width = parseInt(svg.style('width'));
  const height = parseInt(svg.style('height'));

  const root = d3.hierarchy(data);
  const treeLayout = d3.tree().size([width - 40, height - 40]);
  treeLayout(root);

  svg.append('g')
    .attr('transform', 'translate(20,20)')
    .selectAll('path')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y));

  const node = svg.append('g')
    .attr('transform', 'translate(20,20)')
    .selectAll('g')
    .data(root.descendants())
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  node.append('circle').attr('r', 4);
  node.append('text')
    .attr('dy', -8)
    .attr('text-anchor', 'middle')
    .text(d => d.data.name);
}

async function main() {
  const { persons, families } = await loadData();
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');

  searchBtn.onclick = () => {
    const results = searchPersons(persons, searchInput.value);
    resultsDiv.innerHTML = '';
    results.forEach(r => {
      const btn = document.createElement('button');
      btn.textContent = r.name;
      btn.onclick = () => {
        const tree = buildTreeData(persons, families, r.id);
        if (tree) renderTree(tree);
      };
      resultsDiv.appendChild(btn);
    });
  };
}

main();
