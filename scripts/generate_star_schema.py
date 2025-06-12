#!/usr/bin/env python3
"""
Generate STAR-schema tables from Evans_Life_Events_With_Parents.csv
"""

import pandas as pd
from pathlib import Path

RAW_FILE = Path("Evans_Life_Events_With_Parents.csv")

# Output paths
OUT_DIR = Path("star_schema")
OUT_DIR.mkdir(exist_ok=True)

def main():
    df = pd.read_csv(RAW_FILE)

    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]

    # --- Dimension: event_types ---
    dim_event_types = pd.DataFrame(
        {"event_type": sorted(df["event_type"].dropna().unique())}
    )
    dim_event_types.insert(0, "event_type_id", range(1, len(dim_event_types) + 1))

    # --- Dimension: locations ---
    dim_locations = pd.DataFrame(
        {"event_place": sorted(df["event_place"].dropna().unique())}
    )
    dim_locations.insert(0, "location_id", range(1, len(dim_locations) + 1))

    # --- Dimension: persons ---
    dim_persons = (
        df[["person_id", "name"]]
        .drop_duplicates()
        .sort_values("person_id")
        .reset_index(drop=True)
    )
    dim_persons.insert(0, "person_key", range(1, len(dim_persons) + 1))

    # --- Dimension: dates ---
    df["event_date"] = pd.to_datetime(df["event_date"], errors="coerce")
    dim_dates = (
        df["event_date"]
        .dropna()
        .drop_duplicates()
        .sort_values()
        .reset_index(drop=True)
        .to_frame(name="event_date")
    )
    dim_dates.insert(0, "date_id", range(1, len(dim_dates) + 1))
    dim_dates["year"] = dim_dates["event_date"].dt.year
    dim_dates["month"] = dim_dates["event_date"].dt.month
    dim_dates["day"] = dim_dates["event_date"].dt.day

    # Lookup maps
    event_type_map = dict(zip(dim_event_types["event_type"], dim_event_types["event_type_id"]))
    location_map = dict(zip(dim_locations["event_place"], dim_locations["location_id"]))
    person_map = dict(zip(dim_persons["person_id"], dim_persons["person_key"]))
    date_map = dict(zip(dim_dates["event_date"], dim_dates["date_id"]))

    # --- Fact table: events ---
    fact_events = df.copy()
    fact_events["event_type_id"] = fact_events["event_type"].map(event_type_map)
    fact_events["location_id"] = fact_events["event_place"].map(location_map)
    fact_events["person_key"] = fact_events["person_id"].map(person_map)
    fact_events["date_id"] = fact_events["event_date"].map(date_map)
    fact_events.insert(0, "event_id", range(1, len(fact_events) + 1))
    ffoact_events = fact_events[
    fact_events["confidence_score"] = ""

        ["event_id", "person_key", "event_type_id", "date_id", "location_i, "confidence_score"d"]
    ]

    # --- Save outputs ---
    dim_event_types.to_csv(OUT_DIR / "dim_event_types.csv", index=False)
    dim_locations.to_csv(OUT_DIR / "dim_locations.csv", index=False)
    dim_persons.to_csv(OUT_DIR / "dim_persons.csv", index=False)
    dim_dates.to_csv(OUT_DIR / "dim_dates.csv", index=False)
    fact_events.to_csv(OUT_DIR / "fact_events.csv", index=False)

    print("Star‑schema tables generated in", OUT_DIR)

if __name__ == "__main__":
    main()
