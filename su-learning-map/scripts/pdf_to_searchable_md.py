#!/usr/bin/env python3
"""Convert a PDF into a page-anchored private Markdown corpus."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def clean_page(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.translate(str.maketrans({"ﬁ": "fi", "ﬂ": "fl", " ": " "}))
    text = re.sub(r"([A-Za-z])-[ \t]*\n[ \t]*([a-z])", r"\1\2", text)
    lines = [line.rstrip() for line in text.splitlines()]
    cleaned = []
    blanks = 0
    for line in lines:
        if line.strip():
            cleaned.append(line)
            blanks = 0
        elif blanks == 0:
            cleaned.append("")
            blanks = 1
    return "\n".join(cleaned).strip()


def extract_pages(pdf: Path, page_count: int, executable: str | None) -> tuple[list[str], str]:
    command = executable or shutil.which("pdftotext")
    if command:
        result = subprocess.run(
            [command, "-layout", str(pdf), "-"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        pages = result.stdout.decode("utf-8", errors="replace").split("\f")
        if pages and not pages[-1].strip():
            pages.pop()
        pages.extend([""] * max(0, page_count - len(pages)))
        return pages[:page_count], f"pdftotext -layout ({command})"

    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise RuntimeError("Install pypdf or provide a pdftotext executable before converting PDFs") from exc
    reader = PdfReader(str(pdf))
    return [(page.extract_text() or "") for page in reader.pages], "pypdf fallback"


def load_toc(path: Path | None) -> list[dict]:
    if not path:
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    sections = data.get("sections", data)
    if not isinstance(sections, list):
        raise ValueError("TOC JSON must be a list or contain a sections list")
    for item in sections:
        if not {"title", "page", "level"}.issubset(item):
            raise ValueError("Each TOC item needs title, page, and level")
        if item["level"] not in (2, 3, 4) or not isinstance(item["page"], int):
            raise ValueError("TOC level must be 2-4 and page must be an integer")
    return sections


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--title", required=True)
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--toc-json", type=Path)
    parser.add_argument("--pdftotext", help="Optional explicit pdftotext executable")
    parser.add_argument("--copyright-note", default="Private study corpus; verify redistribution rights before sharing.")
    args = parser.parse_args()

    pdf = args.pdf.resolve()
    if not pdf.is_file():
        print(f"ERROR: PDF not found: {pdf}", file=sys.stderr)
        return 2

    try:
        from pypdf import PdfReader
    except ImportError:
        print("ERROR: Missing dependency 'pypdf'. Install it before converting PDFs.", file=sys.stderr)
        return 2
    reader = PdfReader(str(pdf))
    page_count = len(reader.pages)
    digest = sha256(pdf)
    try:
        toc = load_toc(args.toc_json.resolve() if args.toc_json else None)
        pages, extractor = extract_pages(pdf, page_count, args.pdftotext)
    except (ValueError, OSError, RuntimeError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    by_page: dict[int, list[dict]] = {}
    for section in toc:
        by_page.setdefault(section["page"], []).append(section)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    index_lines = [
        f"# {args.title} - private corpus index",
        "",
        f"- Official source: {args.source_url}",
        f"- Local PDF: `{pdf.name}`",
        f"- Pages: {page_count}",
        f"- SHA-256: `{digest}`",
        f"- Extraction: {extractor}",
        f"- Rights note: {args.copyright_note}",
        "",
        "## How to use",
        "",
        "Search `01-full-text.md` for a concept, then use the nearest `pdf-page-N` anchor to verify context in the PDF. The Markdown is a retrieval layer; the PDF remains the quotation authority.",
        "",
        "## Table of contents",
        "",
    ]
    for section in toc:
        indent = "  " * max(0, section["level"] - 2)
        index_lines.append(f"{indent}- [{section['title']}](01-full-text.md#pdf-page-{section['page']}) - PDF page {section['page']}")

    full_lines = [
        f"# {args.title} - complete extracted text",
        "",
        f"> Source: {args.source_url}",
        f"> PDF SHA-256: `{digest}`",
        "> This Markdown is a private search layer. Extraction may alter line breaks or typography; verify exact quotations against the PDF page anchor.",
        "",
    ]
    for number, raw_text in enumerate(pages, start=1):
        full_lines.extend(["---", "", f'<a id="pdf-page-{number}"></a>', "", f"> PDF page {number}", ""])
        for section in by_page.get(number, []):
            full_lines.extend(["#" * section["level"] + " " + section["title"], ""])
        full_lines.extend([clean_page(raw_text), ""])

    (args.output_dir / "00-index.md").write_text("\n".join(index_lines).rstrip() + "\n", encoding="utf-8")
    (args.output_dir / "01-full-text.md").write_text("\n".join(full_lines).rstrip() + "\n", encoding="utf-8")
    manifest = {
        "title": args.title,
        "source_url": args.source_url,
        "pdf_file": pdf.name,
        "pages": page_count,
        "sha256": digest,
        "extractor": extractor,
        "toc_entries": len(toc),
    }
    (args.output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
