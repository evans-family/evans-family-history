import json
import argparse


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Convert genealogical JSON to the BALKAN FamilyTreeJS format"
    )
    parser.add_argument("input", help="Input JSON file path")
    parser.add_argument("output", help="Output JSON file path")
    parser.add_argument(
        "--skip-unknown",
        action="store_true",
        help="Skip individuals without a known name",
    )
    return parser.parse_args()


def load_data(path):
    with open(path) as f:
        return json.load(f)


def main():
    args = parse_args()
    data = load_data(args.input)

    persons = data.get("persons", {})
    families = data.get("families", {})

    nodes = []
    for pid, p in persons.items():
        name = p.get("NAME", {}).get("TEXT", "Unknown").replace('/', '')
        if args.skip_unknown and name == "Unknown":
            continue
        node = {"id": pid, "name": name}

        sex = p.get("SEX")
        if sex == 'M':
            node["gender"] = "male"
            node["template"] = "john"
        elif sex == 'F':
            node["gender"] = "female"
            node["template"] = "ana"

        famc = p.get("FAMC")
        if famc and famc in families:
            fam = families[famc]
            father = fam.get("HUSB", {}).get("PERSON")
            mother = fam.get("WIFE", {}).get("PERSON")
            if father:
                node["fid"] = father
            if mother:
                node["mid"] = mother

        fams = p.get("FAMS")
        fam_ids = fams if isinstance(fams, list) else ([fams] if fams else [])
        pids = []
        for fid in fam_ids:
            fam = families.get(fid)
            if not fam:
                continue
            spouse = None
            if fam.get("HUSB", {}).get("PERSON") == pid:
                spouse = fam.get("WIFE", {}).get("PERSON")
            elif fam.get("WIFE", {}).get("PERSON") == pid:
                spouse = fam.get("HUSB", {}).get("PERSON")
            if spouse:
                pids.append(spouse)
        if pids:
            node["pids"] = pids

        nodes.append(node)

    with open(args.output, 'w') as f:
        json.dump(nodes, f, indent=2)


if __name__ == "__main__":
    main()
