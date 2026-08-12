# 三套已跑通的成品

这三个赠品用于证明同一条生产线可以处理不同知识对象。每套都包含：

- 可直接打开的在线学习地图；
- 可离线运行的静态网页源码；
- 可安装的人物框架 Skill；
- 最短调用示例与适用场景。

完整书籍、全文 Markdown、私人笔记、RAG 数据库、账号与 Secret 不在仓库中。

| 成品 | 在线学习地图 | 本地网页 | Skill | 最短调用 |
|---|---|---|---|---|
| 纳瓦尔 | [打开](https://naval-learning-map.pages.dev/) | [`naval/learning-map/`](naval/learning-map/) | [`naval-perspective`](naval/skill/naval-perspective/) | `$naval-perspective 帮我判断这个项目是在出售时间，还是积累所有权与可复利资产。` |
| 李笑来 | [打开](https://li-xiaolai-learning-map.pages.dev/) | [`li-xiaolai/learning-map/`](li-xiaolai/learning-map/) | [`li-xiaolai-perspective`](li-xiaolai/skill/li-xiaolai-perspective/) | `$li-xiaolai-perspective 帮我重新定义这个问题，并检查我的注意力与个人商业模式。` |
| 马斯克 | [打开](https://elon-learning-map.pages.dev/) | [`elon-musk/learning-map/`](elon-musk/learning-map/) | [`elon-musk-perspective`](elon-musk/skill/elon-musk-perspective/) | `$elon-musk-perspective 帮我找出这个方案的硬约束、瓶颈和最快验证动作。` |

## 怎么安装其中一个 Skill

把相应的 `skill/<skill-name>/` 目录复制到 Agent 的 Skills 目录，或直接把该目录链接交给支持 Agent Skills 的 Agent 安装。安装后用表格中的 `$skill-name` 调用。

## 怎么在本地打开学习地图

进入对应的 `learning-map/` 目录，直接打开 `index.html` 即可。它们都是静态网页，不需要后端服务。

## 公开边界

这些网页与 Skills 是学习摘要和框架工具，不冒充人物本人，也不代表人物当前观点。精确引用应沿来源定位回到公开原始材料；涉及当前公司、产品、市场、政策、人物立场或投资事实时，应重新联网核验。

