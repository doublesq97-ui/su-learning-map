# Learning content contract

The builder consumes one JSON file.

```json
{
  "meta": {
    "slug": "naval-learning-system",
    "page_title": "纳瓦尔学习地图",
    "brand": "NAVAL / LEARNING SYSTEM",
    "edition": "个人学习阅读器 · 15 个概念 · 一手来源",
    "hero_title": "把思想，",
    "hero_emphasis": "学成自己的判断。",
    "hero_lede": "每次学习一个概念，回到来源，再写下自己的答案。",
    "source_note": "来源为公开材料；内容为学习摘要，不代表本人当前观点。",
    "content_depth": "deep"
  },
  "chapters": [
    {"id": "wealth", "no": "01", "name": "创造财富", "promise": "识别可复利的杠杆", "ids": [1, 2, 3]}
  ],
  "concepts": [
    {
      "id": 1,
      "name": "财富不是金钱",
      "chapter": "wealth",
      "locator": "The Almanack — Building Wealth",
      "source_url": "https://example.com",
      "evidence": "corroborated",
      "desc": "财富是能在你不投入实时劳动时继续创造价值的资产。",
      "excerpt": "基于来源的摘要或经核验的短引文。",
      "context": "这个概念在原始材料中回应什么问题，以及为什么要放在这里学习。",
      "arguments": ["第一层推理。", "第二层推理。", "第三层推理。"],
      "source_digest": ["第一段忠实中文转述。", "第二段忠实中文转述。"],
      "boundary": "这一观点最容易被怎样误用，以及它依赖什么条件。",
      "connections": [2, 3],
      "practice": "你现在拥有的哪些东西，在你不工作时仍能创造价值？"
    }
  ]
}
```

## Rules

- `meta.slug` must be lowercase letters, digits, or hyphens.
- IDs must be unique positive integers.
- Every concept's `chapter` must exist and every chapter ID list must resolve.
- Chapter order defines the default learning route.
- `locator`, `source_url`, and `evidence` are required.
- `evidence` must be `primary`, `corroborated`, `external`, `inference`, or `current`.
- `excerpt` may contain a summary. Do not label a summary as an original quote.
- Write one practice question that can produce a concrete answer.
- Use 3-7 chapters. Concept count follows corpus depth; do not force 52.
- When `meta.content_depth` is `deep`, every concept must include non-empty `context`, at least three `arguments`, at least two `source_digest` paragraphs, a `boundary`, and at least one valid concept ID in `connections`.
- Deep mode also enforces minimum substance: context ≥ 50 characters, the argument chain ≥ 100 characters total, source digest ≥ 220 characters total, and boundary ≥ 40 characters. These are floors, not writing targets.
