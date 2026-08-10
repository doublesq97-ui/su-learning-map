# Distill to Learning System

Turn a book, PDF corpus, course, public person's body of work, or structured topic into an evidence-backed callable Skill and a searchable, mobile-friendly learning map.

它不是“把资料总结得更短”，而是一条可复用的学习产品生产线：

```text
原始材料
→ 私有证据层
→ 可调用 Skill
→ 学习路径与概念卡
→ 响应式学习地图
→ 可选部署
```

## 它会产出什么

- 带来源定位的私有 Markdown 检索层；
- 能区分原文、综合、推断和当前事实的主题或人物 Skill；
- 3–7 条能力学习路径与按证据深度确定的概念卡；
- 支持搜索、笔记、进度和手机阅读的静态学习地图；
- 可选的 Cloudflare Pages 部署包、验证记录和部署台账。

## 与普通蒸馏 Skill 的关系

人物蒸馏 Skill 解决“怎样让 AI 使用某个人的框架回答”。本项目在需要时调用这类能力，然后继续完成证据、学习、体验和交付层。两者是专业工位与完整生产线的关系，不是互相替代。

## 快速调用

```text
$distill-to-learning-system
主题：[填写]
材料：[文件、目录或 URL]
交付：[完整流程 / 仅私有语料 / 仅 Skill / 仅学习地图]
联网：[需要 / 不需要 / 你判断]
Cloudflare Pages：[部署 / 暂不部署]
```

完整可复制提示词见 [`references/quick-invocation.md`](distill-to-learning-system/references/quick-invocation.md)。

## 安装

将仓库中的 `distill-to-learning-system/` 文件夹复制到 Codex Skills 目录，或让 Codex 使用 `skill-installer` 从本仓库安装该子目录。安装后通过 `$distill-to-learning-system` 调用。

## 公开与私有边界

本仓库不包含任何完整书籍、付费课程原文、个人私有语料、Cloudflare 项目信息、内部部署台账或 Secret。

默认规则：

- 完整 PDF 与全文 Markdown 留在本地；
- 公开地图只使用摘要、必要的短引用、来源定位和官方链接；
- Cloudflare 部署可选，且不要求 GitHub 集成或自定义域名；
- 公开前必须检查输出目录，确认没有私有语料和凭据。

## 仓库结构

```text
distill-to-learning-system/
├── SKILL.md
├── agents/
├── scripts/
├── references/
└── assets/
```

## License

MIT. See [`LICENSE`](LICENSE).
