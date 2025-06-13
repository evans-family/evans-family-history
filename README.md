# Evans Family History

This repository stores genealogical data and supporting tools for the Evans family tree. The GEDCOM file has been converted to JSON and a small web viewer is provided.

## Directory layout

- **data/** – contains the family tree JSON file
- **scripts/** – utilities such as the GEDCOM to JSON converter
- **webapp/** – JavaScript application for exploring the tree
- **data_science/** – placeholder for Python analysis workflows

The project may later integrate with AWS for hosting and data processing.

To share the viewer online, enable GitHub Pages for this repository using the **main** branch.
The repository root contains a small `index.html` file that redirects visitors to
the web application under `webapp/` so the default Pages URL will work.

After enabling GitHub Pages the viewer will be available at
`https://<YOUR_GITHUB_USERNAME>.github.io/evans-family-history/`, where
`<YOUR_GITHUB_USERNAME>` is your GitHub account name.

