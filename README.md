# Evans Family History

This repository stores genealogical data and supporting tools for the Evans family tree. The GEDCOM file has been converted to JSON and a small web viewer powered by [FamilyTreeJS](https://balkan.app/FamilyTreeJS) is provided.

## Directory layout

- **data/** – contains the family tree JSON files
- **scripts/** – utilities such as the GEDCOM to JSON converter
- **webapp/** – JavaScript application for exploring the tree using FamilyTreeJS
- **data_science/** – placeholder for Python analysis workflows

While the converter script remains for reference, the focus of the repository is the interactive family tree viewer that you can share with relatives. The project may later integrate with AWS for hosting and data processing.

To share the viewer online you can publish this repository with GitHub Pages. Follow these steps:

1. Open the repository **Settings** on GitHub and choose **Pages**.
2. Under **Source** select **Deploy from a branch** and pick the `main` branch.
3. Save. GitHub will build the site and provide a URL.

Thanks to the `index.html` in the repository root, visitors to `https://evans.family.github.io/evans-family-history/` will automatically be redirected to the `webapp/` folder where the viewer loads.


You can update the JSON data by running the converter scripts:

```bash
# convert GEDCOM to intermediate JSON
php scripts/gedcom2json.php path/to/input.ged data/EvansFamilyTree.json
# convert that JSON to the format expected by BALKAN FamilyTreeJS
python3 scripts/gedcom_to_balkan.py data/EvansFamilyTree.json data/balkan_familytree.json
```

Once published, share the GitHub Pages URL with relatives so they can explore the tree interactively.
