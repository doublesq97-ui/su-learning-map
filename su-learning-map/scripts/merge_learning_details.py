#!/usr/bin/env python3
"""Merge deep-card detail JSON files into a learning-map project."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("details", nargs="+", type=Path)
    args = parser.parse_args()

    data = json.loads(args.project.read_text(encoding="utf-8"))
    merged: dict[str, dict] = {}
    for path in args.details:
        current = json.loads(path.read_text(encoding="utf-8"))
        overlap = set(merged) & set(current)
        if overlap:
            raise SystemExit(f"Duplicate detail IDs: {sorted(overlap)}")
        merged.update(current)

    expected = {str(item["id"]) for item in data["concepts"]}
    missing = expected - set(merged)
    extra = set(merged) - expected
    if missing or extra:
        raise SystemExit(f"Detail mismatch; missing={sorted(missing)}, extra={sorted(extra)}")

    for concept in data["concepts"]:
        concept.update(merged[str(concept["id"])])
    data["meta"]["content_depth"] = "deep"
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Merged {len(merged)} deep concept cards into {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
