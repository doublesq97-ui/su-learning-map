---
name: distill-to-learning-system
description: Turn a book, PDF corpus, course, topic, or public person's body of work into an evidence-backed callable Skill plus a searchable, mobile-friendly learning map. Use when the user asks to 蒸馏资料并做成 Skill、人物语料自动调研、概念卡片、知识地图、学习地图、私有 Markdown 语料库，或希望把一次资料研究变成可部署的学习产品。 This is a manual, long-running orchestration workflow; do not trigger for ordinary summaries or a single question about a source.
---

# Distill to Learning System

Build a reusable learning system, not merely a summary. Keep evidence, reasoning, callable behavior, learning content, visual presentation, and deployment as separate layers with explicit handoffs.

## Quick invocation

Use the short form when the subject and sources are already clear:

```text
$distill-to-learning-system
主题：[book, person, course, corpus, or topic]
材料：[files, folders, or URLs]
交付：[complete system / private corpus / Skill / learning map]
联网：[required / not required / decide from evidence gaps]
Cloudflare Pages：[deploy / do not deploy]
```

For a copy-ready orchestration prompt and field defaults, read `references/quick-invocation.md`. Infer omitted fields from the supplied material and current context. Pause only at the checkpoints listed below; do not ask the user to restate defaults already encoded in this Skill.

## Start

1. Resolve the subject, intended learner, source boundary, private/public policy, desired outputs, and deployment authorization from the request and supplied material. Ask only when a missing decision triggers a checkpoint below.
2. Inspect existing related Skills before creating a new one. Keep, merge, or use as a benchmark; never overwrite a distinct installed Skill silently.
3. Create a project manifest using the contract in `references/architecture.md`.
4. Read `references/workflow.md` and execute only the phases required by the requested outputs.

For a public person with no supplied corpus, use `huashu-nuwa` for person-level distillation and `agent-reach` for source collection. For a supplied PDF, use the PDF capability and treat the local source as highest-weight evidence.

## Non-negotiable architecture

- Evidence is the source of truth for claims.
- The distilled Skill is the source of truth for callable reasoning behavior.
- Learning data is the source of truth for the map's concepts and exercises.
- Theme JSON is the source of truth for visual tokens; theme CSS and the HTML shell are the deterministic rendering contract.
- Deployment is optional and requires explicit authorization.

Do not put source text, reasoning instructions, UI copy, and CSS into one giant file. Do not use a style prompt as the only visual specification.

## Workflow

### 1. Intake and source strategy

Classify the task as local-source, web-research, or hybrid. Record source ownership, privacy, redistribution constraints, research cutoff, and required evidence depth. Read `references/evidence-and-research.md`.

For a complete local PDF search layer, keep the original PDF private and generate page-anchored Markdown:

```bash
python3 scripts/pdf_to_searchable_md.py SOURCE.pdf CORPUS_DIR \
  --title "Source title" --source-url "OFFICIAL_URL" \
  --toc-json OPTIONAL_TOC.json
```

Treat the Markdown as retrieval text and the PDF page as quotation authority.

### 2. Distill the callable system

Delegate person-level research and cognitive extraction to `huashu-nuwa`; delegate general Skill structure to `skill-creator`. Preserve source-backed claims, cross-source synthesis, framework inference, and current facts as different evidence classes.

The ordinary distillation output may be enough when the user only wants a perspective Skill. Continue only when they also want durable learning or publishing artifacts.

### 3. Build the learning layer

Transform the distilled system into 3-7 learning paths and a concept set sized to the material. Each concept must contain a definition, why it matters, evidence summary or short verified excerpt, source locator, practice question, and relationships. Follow `references/learning-content-schema.md`.

Do not choose a round number before examining the corpus. “52 concepts” is an instance, not a requirement.

When the user asks for a complete-book map, source-enriched cards, or a study edition, set `meta.content_depth` to `deep`. Coverage is not depth: every deep card must reconstruct the question context, a multi-step argument, a substantial source digest, a misuse boundary, and links to related concepts. Run the builder's length checks; do not ship cards that merely repeat a one-line takeaway in several fields.

### 4. Select and render a theme

Default to `wabi-reading` only for reflective, long-form, low-distraction material. Read `references/theme-system.md`. Build with:

```bash
python3 scripts/build_learning_map.py PROJECT_JSON OUTPUT_DIR --theme wabi-reading
```

The builder validates the content graph, copies the stable HTML/CSS/JS shell, and creates browser-ready data. Change content JSON to change the subject; change the theme package to change the visual system.

### 5. Product UX and verification

Use `su-product-ux` before final visual polish. Lock one primary action for the cover, one observable completion signal, and one recovery path. Then verify the real artifact at desktop and mobile sizes.

Apply every relevant gate in `references/quality-gates.md`. Fix structural defects before visual polish.

### 6. Package, deploy, and preserve

Produce only requested deliverables. A complete package may include:

- installed or portable subject Skill;
- private Markdown evidence/index layer;
- public evidence manifest without restricted full-text sources;
- responsive learning-map folder;
- short user calling guide;
- deployment URL when authorized.

Keep private full text out of public deployment. Back up the calling guide where the user expects to find operational documentation.

When Cloudflare Pages deployment is requested, read `references/cloudflare-pages.md`. Prefer Direct Upload for a local static learning map when Git integration is unnecessary. Copy `assets/templates/deployment-ledger.md` into the project records and fill it without recording secret values. Do not claim deployment complete until the public URL and key assets have been verified.

## Checkpoints

Pause only when a decision materially changes scope or public/private consequences:

- source rights or privacy are unclear;
- an existing Skill would be overwritten or materially changed;
- research quality is below the minimum evidence bar;
- the user must choose between conflicting interpretations;
- public deployment, authentication, or paid infrastructure is required but not authorized.

Otherwise proceed with explicit assumptions.

## Output contract

Report:

1. what was created and where;
2. evidence coverage and research cutoff;
3. which parts are source-backed, synthesized, or inferred;
4. desktop/mobile verification evidence;
5. public/private status and deployment behavior;
6. known gaps and the next useful validation case.

Do not claim completion from files alone. Validate the installed Skill and the rendered learning surface.
