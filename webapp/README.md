# Webapp

This folder contains a small JavaScript application for viewing the Evans family tree.
Open `index.html` in a browser or publish the `webapp` directory with GitHub Pages to share it online.
The page shows a search box and visual tree powered by FamilyTreeJS. Selecting a person displays their parents, spouse, and children.
The viewer loads `balkan_familytree.json` which contains nodes in the format expected by the library.

- `index.html` – home page with search and visual tree powered by [FamilyTreeJS](https://balkan.app/FamilyTreeJS). It includes a local copy of `familytree.js`.
- `script.js` – logic for loading the prepared JSON data and rendering the tree
