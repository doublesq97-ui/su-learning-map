# Quick invocation

## Short form

```text
$distill-to-learning-system
主题：[填写]
材料：[文件、目录或 URL]
交付：[完整流程 / 仅私有语料 / 仅 Skill / 仅学习地图]
联网：[需要 / 不需要 / 你判断]
Cloudflare Pages：[部署 / 暂不部署]
```

## Copy-ready orchestration prompt

```text
请读取并执行 distill-to-learning-system Skill。

当前主题：【填写】
当前材料：【附文件、目录或 URL】
目标学习者：【填写；未填写时根据材料与使用场景推断】
交付范围：【完整流程 / 仅私有语料 / 仅 Skill / 仅学习地图】
联网补充：【需要 / 不需要 / 你判断】
Cloudflare Pages：【部署 / 暂不部署】

直接按 Skill、references、scripts 和 assets 中的默认规则执行。不要复述完整规则，也不要要求我重复确认已经明确的信息。

只有在以下情况暂停：
1. 材料缺失或证据质量不足，无法达到当前交付范围；
2. 会覆盖或实质修改一个已有 Skill；
3. 需要改变公开/私有边界；
4. 部署需要新增付费资源、认证方式或我尚未授权的外部写操作。

完成时报告：产物位置、证据范围、推断边界、桌面与手机验证、公开状态、部署状态和下一个验证案例。
```

## Defaults

- Keep complete books, paid course text, private notes, and full searchable Markdown local unless redistribution rights are explicit.
- Use summaries, short verified excerpts, locators, and source links in public maps.
- Do not overwrite an existing subject Skill silently.
- Treat deployment as opt-in. A generated folder is not a verified deployment.
- When the user requests the complete system, preserve all layers: evidence, callable behavior, learning content, experience, and delivery.
