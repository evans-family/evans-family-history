# Evans Family History

[Demo Tree](https://evans.family.github.io/evans-family-history/)

This repository stores genealogical data and supporting tools for the Evans family tree. The GEDCOM file has been converted to JSON and a simple JavaScript viewer is provided.

You can explore the information online through the [family history dashboard](https://evans-family.github.io/evans-family-history/).

## Directory layout

- **data/** – contains the family tree JSON files
- **scripts/** – utilities such as the GEDCOM to JSON converter
- **viewer/** – JavaScript application for exploring the tree 
- **data_science/** – placeholder for Python analysis workflows

While the converter script remains for reference, the focus of the repository is the interactive family tree viewer that you can share with relatives. The project may later integrate with AWS for hosting and data processing.

To share the viewer online you can publish this repository with GitHub Pages. Follow these steps:

1. Open the repository **Settings** on GitHub and choose **Pages**.
2. Under **Source** select **Deploy from a branch** and pick the `main` branch.
3. Save. GitHub will build the site and provide a URL.

Thanks to the `index.html` in the repository root, visitors to `https://evans.family.github.io/evans-family-history/` will automatically be redirected to the `viewer/` folder where the viewer loads. The viewer fetches `data/balkan_familytree.json` directly.


If you encounter a **404 File not found** error when visiting the site, ensure that GitHub Pages is enabled from the repository **Settings** and the `main` branch is selected as the source. The included `404.html` page will redirect broken links back to the viewer.
You can update the JSON data by running the converter scripts:

```bash
# convert GEDCOM to intermediate JSON
php scripts/gedcom2json.php path/to/input.ged data/EvansFamilyTree.json
# convert that JSON to the format expected by BALKAN FamilyTreeJS
python3 scripts/gedcom_to_balkan.py data/EvansFamilyTree.json data/balkan_familytree.json
```

Once published, share the GitHub Pages URL with relatives so they can explore the tree interactively.



