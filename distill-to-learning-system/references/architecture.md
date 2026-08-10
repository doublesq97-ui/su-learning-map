# Architecture and project manifest

## Layers

| Layer | Source of truth | Responsibility |
|---|---|---|
| Intake | `project.json` | subject, audience, scope, privacy, outputs |
| Evidence | source manifest + corpus | what the material actually supports |
| Distillation | subject Skill + concept map | how the subject defines, connects, judges, and refuses |
| Learning | learning-data JSON | paths, concepts, evidence notes, exercises, links |
| Experience | theme package + reader shell | hierarchy, navigation, progress, responsive behavior |
| Delivery | output folder / hosting target | packaging, public/private boundary, deploy status |

Never let a downstream layer silently rewrite an upstream truth. A visual card may shorten a concept, but it cannot change the evidence classification.

## User-visible and internal objects

The learner sees the subject title, learning paths, concept reader, source locator, practice prompt, notes, and progress.

The agent maintains the source manifest, evidence grades, project configuration, raw research, build logs, theme package, and verification report. Do not make these internal objects user obligations.

## Minimal project manifest

```json
{
  "subject": "Naval Ravikant",
  "slug": "naval-learning-system",
  "audience": "self-directed learner",
  "source_mode": "web-research",
  "privacy": {
    "private_corpus": true,
    "public_map": false
  },
  "outputs": ["subject-skill", "learning-map", "calling-guide"],
  "theme": "wabi-reading",
  "research_cutoff": "YYYY-MM-DD"
}
```

## Ownership rules

- Existing subject Skill: inspect and preserve unless update is explicitly requested.
- Full local books/PDFs: private evidence layer only unless distribution rights are clear.
- Public learning map: use summaries, short verified excerpts, locators, and links.
- Deployment: separate opt-in action; default is local output.

