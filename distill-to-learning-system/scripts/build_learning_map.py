#!/usr/bin/env python3
"""Build a deterministic static learning map from validated JSON."""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import sys
from pathlib import Path


EVIDENCE = {"primary", "corroborated", "external", "inference", "current"}
META_FIELDS = {
    "slug",
    "page_title",
    "brand",
    "edition",
    "hero_title",
    "hero_emphasis",
    "hero_lede",
    "source_note",
}
CONCEPT_FIELDS = {
    "id",
    "name",
    "chapter",
    "locator",
    "source_url",
    "evidence",
    "desc",
    "excerpt",
    "practice",
}


def fail(message: str) -> None:
    raise ValueError(message)


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"Cannot read valid JSON from {path}: {exc}")


def validate(data: dict) -> None:
    if not isinstance(data, dict):
        fail("Project data must be a JSON object")
    meta = data.get("meta")
    chapters = data.get("chapters")
    concepts = data.get("concepts")
    if not isinstance(meta, dict) or not META_FIELDS.issubset(meta):
        fail(f"meta is missing fields: {sorted(META_FIELDS - set(meta or {}))}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", str(meta["slug"])):
        fail("meta.slug must use lowercase letters, digits, and hyphens")
    if not isinstance(chapters, list) or not 3 <= len(chapters) <= 7:
        fail("chapters must contain 3 to 7 learning paths")
    if not isinstance(concepts, list) or not concepts:
        fail("concepts must be a non-empty list")

    chapter_ids = set()
    routed_ids = []
    for chapter in chapters:
        required = {"id", "no", "name", "promise", "ids"}
        if not isinstance(chapter, dict) or not required.issubset(chapter):
            fail(f"chapter is missing fields: {sorted(required - set(chapter or {}))}")
        if chapter["id"] in chapter_ids:
            fail(f"duplicate chapter id: {chapter['id']}")
        chapter_ids.add(chapter["id"])
        if not isinstance(chapter["ids"], list) or not chapter["ids"]:
            fail(f"chapter {chapter['id']} has no concepts")
        routed_ids.extend(chapter["ids"])

    concept_ids = set()
    for concept in concepts:
        if not isinstance(concept, dict) or not CONCEPT_FIELDS.issubset(concept):
            fail(f"concept is missing fields: {sorted(CONCEPT_FIELDS - set(concept or {}))}")
        cid = concept["id"]
        if not isinstance(cid, int) or cid <= 0 or cid in concept_ids:
            fail(f"concept id must be a unique positive integer: {cid}")
        concept_ids.add(cid)
        if concept["chapter"] not in chapter_ids:
            fail(f"concept {cid} references unknown chapter {concept['chapter']}")
        if concept["evidence"] not in EVIDENCE:
            fail(f"concept {cid} has invalid evidence class {concept['evidence']}")
        if not re.match(r"^https?://", str(concept["source_url"])):
            fail(f"concept {cid} source_url must be http(s)")
        for field in ("name", "locator", "desc", "excerpt", "practice"):
            if not str(concept[field]).strip():
                fail(f"concept {cid} has empty {field}")
        if meta.get("content_depth") == "deep":
            if not str(concept.get("context", "")).strip():
                fail(f"deep concept {cid} has no context")
            if not isinstance(concept.get("arguments"), list) or len(concept["arguments"]) < 3:
                fail(f"deep concept {cid} needs at least three arguments")
            if not isinstance(concept.get("source_digest"), list) or len(concept["source_digest"]) < 2:
                fail(f"deep concept {cid} needs at least two source_digest paragraphs")
            if not str(concept.get("boundary", "")).strip():
                fail(f"deep concept {cid} has no boundary")
            if not isinstance(concept.get("connections"), list) or not concept["connections"]:
                fail(f"deep concept {cid} needs concept connections")
            if len(str(concept["context"]).strip()) < 50:
                fail(f"deep concept {cid} context is too short")
            if sum(len(str(item).strip()) for item in concept["arguments"]) < 100:
                fail(f"deep concept {cid} argument chain is too short")
            if sum(len(str(item).strip()) for item in concept["source_digest"]) < 220:
                fail(f"deep concept {cid} source digest is too short")
            if len(str(concept["boundary"]).strip()) < 40:
                fail(f"deep concept {cid} boundary is too short")

    if len(routed_ids) != len(set(routed_ids)):
        fail("a concept appears more than once in chapter routes")
    if set(routed_ids) != concept_ids:
        fail("chapter routes and concept IDs do not match")
    by_id = {c["id"]: c for c in concepts}
    if meta.get("content_depth") == "deep":
        for concept in concepts:
            unknown = set(concept["connections"]) - concept_ids
            if unknown:
                fail(f"deep concept {concept['id']} has unknown connections: {sorted(unknown)}")
    for chapter in chapters:
        for cid in chapter["ids"]:
            if by_id[cid]["chapter"] != chapter["id"]:
                fail(f"concept {cid} route disagrees with its chapter field")


def token_css(theme: dict, path_count: int) -> str:
    tokens = theme.get("tokens")
    if not isinstance(tokens, dict) or not tokens:
        fail("theme.json must contain tokens")
    lines = [":root{"]
    for key, value in tokens.items():
        if not re.fullmatch(r"[a-z0-9-]+", key):
            fail(f"invalid theme token name: {key}")
        lines.append(f"  --{key}:{value};")
    lines.append(f"  --path-count:{path_count};")
    lines.append("}\n")
    return "\n".join(lines)


def build(project_path: Path, output_dir: Path, theme_name: str) -> None:
    skill_dir = Path(__file__).resolve().parents[1]
    template_dir = skill_dir / "assets" / "templates" / "reader"
    theme_dir = skill_dir / "assets" / "themes" / theme_name
    if not theme_dir.is_dir():
        fail(f"unknown theme: {theme_name}")

    data = load_json(project_path)
    validate(data)
    theme = load_json(theme_dir / "theme.json")
    output_dir.mkdir(parents=True, exist_ok=True)

    replacements = {
        "PAGE_TITLE": data["meta"]["page_title"],
        "BRAND": data["meta"]["brand"],
        "CONCEPT_COUNT": str(len(data["concepts"])),
        "EDITION": data["meta"]["edition"],
        "HERO_TITLE": data["meta"]["hero_title"],
        "HERO_EMPHASIS": data["meta"]["hero_emphasis"],
        "HERO_LEDE": data["meta"]["hero_lede"],
        "SOURCE_NOTE": data["meta"]["source_note"],
    }
    page = (template_dir / "index.html").read_text(encoding="utf-8")
    for key, value in replacements.items():
        page = page.replace("{{" + key + "}}", html.escape(str(value)))
    if re.search(r"{{[A-Z_]+}}", page):
        fail("unresolved template placeholder remains")

    (output_dir / "index.html").write_text(page, encoding="utf-8")
    shutil.copy2(template_dir / "base.css", output_dir / "base.css")
    shutil.copy2(template_dir / "app.js", output_dir / "app.js")
    shutil.copy2(theme_dir / "theme.css", output_dir / "theme.css")
    (output_dir / "tokens.css").write_text(token_css(theme, len(data["chapters"])), encoding="utf-8")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    (output_dir / "data.js").write_text(f"window.LEARNING_DATA={payload};\n", encoding="utf-8")
    manifest = {
        "project": data["meta"]["slug"],
        "theme": theme_name,
        "concepts": len(data["concepts"]),
        "chapters": len(data["chapters"]),
        "files": ["index.html", "base.css", "theme.css", "tokens.css", "app.js", "data.js"],
    }
    (output_dir / "build-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(manifest, ensure_ascii=False))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_json", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--theme", default="wabi-reading")
    args = parser.parse_args()
    try:
        build(args.project_json.resolve(), args.output_dir.resolve(), args.theme)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
