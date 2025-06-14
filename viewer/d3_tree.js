async function loadTree() {
  const data = await d3.json('../data/EvansFamilyTree.json');
  const persons = data.persons;
  const families = data.families;

  const nodes = [];
  for (const [id, p] of Object.entries(persons)) {
    const nameObj = p.NAME || {};
    const name = nameObj.GIVN ? `${nameObj.GIVN} ${nameObj.SURN || ''}`.trim() : (nameObj.TEXT || id);
    let parentId = null;
    if (p.FAMC && families[p.FAMC]) {
      const fam = families[p.FAMC];
      parentId = fam.HUSB?.PERSON || fam.WIFE?.PERSON || null;
    }
    nodes.push({ id, name, parentId });
  }

  const rootData = nodes.find(n => !n.parentId);
  if (!rootData) {
    console.error('No root found');
    return;
  }

  const stratify = d3.stratify().id(d => d.id).parentId(d => d.parentId);
  const root = stratify(nodes);

  const width = 960;
  const dx = 10;
  const dy = width / (root.height + 1);
  const treeLayout = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  treeLayout(root);

  const height = root.height * dx + 40;

  const svg = d3.select('#chart').append('svg')
      .attr('viewBox', [-dy / 3, -dx, width, height])
      .style('font', '10px sans-serif')
      .style('user-select', 'none');

  const gLink = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(root.links())
    .join('path')
      .attr('d', diagonal);

  const gNode = svg.append('g')
    .selectAll('g')
    .data(root.descendants())
    .join('g')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .attr('class', 'node');

  gNode.append('circle')
      .attr('r', 2.5);

  gNode.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -6 : 6)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => persons[d.id].NAME?.GIVN ? `${persons[d.id].NAME.GIVN} ${persons[d.id].NAME.SURN || ''}` : (persons[d.id].NAME?.TEXT || d.id))
    .clone(true).lower()
      .attr('stroke', 'white');
}

loadTree();
