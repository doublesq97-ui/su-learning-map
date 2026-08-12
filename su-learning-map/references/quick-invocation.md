# 快速安装与调用

## 安装

把下面整段复制给支持 Agent Skills 的 Agent：

```text
请帮我安装这个 GitHub 仓库里的 `su-learning-map` Skill：
https://github.com/doublesq97-ui/su-learning-map

安装完成后，请告诉我：
1. 安装到了哪里；
2. 如何快速调用；
3. 第一次使用需要准备什么材料；
4. 给我一条可以直接替换内容的最短调用示例。
```

## Short form

```text
$su-learning-map
主题：[填写]
材料：[文件、目录或 URL]
交付：[完整流程 / 仅私有语料 / 仅 Skill / 仅学习地图]
联网：[需要 / 不需要 / 你判断]
Cloudflare Pages：[部署 / 暂不部署]
```

## Copy-ready orchestration prompt

```text
请读取并执行 su-learning-map Skill。

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

## Script dependency

The scripts require Python 3.10+. `pdf_to_searchable_md.py` additionally requires `pypdf`; it uses `pdftotext` for body extraction when that executable is available.
Image-only scanned PDFs need OCR before conversion; the bundled script does not OCR page images.
