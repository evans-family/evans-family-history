# Conversion Scripts

This folder contains utilities for transforming genealogical data.

- `gedcom2json.php` – converts a GEDCOM file to an intermediate JSON format.
- `gedcom_to_balkan.py` – turns that JSON into the structure expected by the
  [BALKAN FamilyTreeJS](https://balkan.app/FamilyTreeJS) viewer.

Usage example:

```bash
php gedcom2json.php path/to/input.ged data/EvansFamilyTree.json
python3 gedcom_to_balkan.py data/EvansFamilyTree.json webapp/balkan_familytree.json
```

Run `python3 gedcom_to_balkan.py --help` for additional options such as
`--skip-unknown` to omit individuals without a recorded name.
