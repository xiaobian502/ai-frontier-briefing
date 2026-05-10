# AI前沿情报站

一个适合 iPhone 添加到主屏幕使用的 Next.js PWA MVP。产品目标是每天为中文用户筛选 5 条最重要的 AI 前沿动态，强调“哪些消息值得看”，而不是做大而全新闻站。

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- PWA manifest + iPhone 主屏幕图标
- 自动抓取公开 RSS，mock 数据作为备用

## 本地运行

```bash
npm install
npm run dev
```

打开浏览器访问：

```bash
http://localhost:3000
```

## 项目结构

```text
app/
  layout.tsx       # 全局元信息、PWA/iPhone 配置
  page.tsx         # 首页界面
  globals.css      # 全局样式
data/
  mockBriefing.ts  # 抓取失败时的备用数据
  sourceFeeds.ts   # 自动抓取来源
lib/
  briefing.ts      # RSS 抓取、解析、打分、筛选
public/
  manifest.webmanifest
  sw.js            # 基础离线缓存
  icons/           # PWA 与 iPhone 图标
```

## 自动展示每日内容

首页会在服务端自动抓取 `data/sourceFeeds.ts` 里的公开 RSS 来源，并按来源权重、发布时间和关键词进行简单打分，自动选出 5 条展示。

当前默认来源包括：

- 量子位
- InfoQ
- 36氪
- 极客公园
- OpenAI
- GitHub AI & ML
- Microsoft AI
- NVIDIA Blog
- VentureBeat AI
- The Verge AI
- MIT Technology Review

`data/mockBriefing.ts` 只作为网络失败或来源不足时的备用数据。

后续可以把 `dailyBriefing` 替换为：

- RSS 抓取后的精选结果
- 后台管理系统发布的数据
- 第三方 AI 新闻 API
- 定时任务生成的 JSON 文件

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 打开 [Vercel](https://vercel.com/) 并导入该仓库。
3. Framework Preset 选择 Next.js。
4. 保持默认构建命令 `npm run build`。
5. 部署完成后访问 Vercel 提供的 HTTPS 地址。

## 在 iPhone 上添加到主屏幕

1. 用 iPhone 的 Safari 打开部署后的 HTTPS 地址。
2. 点击底部分享按钮。
3. 选择“添加到主屏幕”。
4. 确认名称为“AI情报站”或自定义名称。
5. 从主屏幕打开后，会以接近原生 App 的 standalone 模式显示。

## 后续迭代建议

- 增加自动抓取来源：RSS、官方博客、论文站点、产品更新页。
- 增加“筛选理由”生成流程：先聚合候选消息，再人工或 AI 打分。
- 增加后台管理：编辑标题、摘要、等级、影响人群和原文链接。
- 增加每日归档：保留过去 7 天或 30 天的情报。
- 增加推送或订阅：适合做成早间提醒。
