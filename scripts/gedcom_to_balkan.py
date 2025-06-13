import json
import sys

if len(sys.argv) != 3:
    print("Usage: python gedcom_to_balkan.py input.json output.json")
    sys.exit(1)

with open(sys.argv[1]) as f:
    data = json.load(f)

persons = data.get("persons", {})
families = data.get("families", {})

nodes = []
for pid, p in persons.items():
    node = {"id": pid, "name": p.get("NAME", {}).get("TEXT", "Unknown").replace('/', '')}
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

with open(sys.argv[2], 'w') as f:
    json.dump(nodes, f, indent=2)
