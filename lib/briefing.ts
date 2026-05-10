import { dailyBriefing, type Audience, type BriefingItem, type ImportanceLevel } from "@/data/mockBriefing";
import { sourceFeeds, type SourceFeed } from "@/data/sourceFeeds";

type FeedEntry = {
  title: string;
  description: string;
  link: string;
  publishedAt: string;
  source: SourceFeed;
};

type RankedEntry = FeedEntry & {
  score: number;
  level: ImportanceLevel;
  audience: Audience[];
  reason: string;
};

const aiKeywords = [
  "ai",
  "artificial intelligence",
  "agent",
  "agents",
  "model",
  "llm",
  "multimodal",
  "robot",
  "reasoning",
  "生成",
  "模型",
  "智能体",
  "多模态",
  "大模型"
];

const scoreKeywords = [
  "launch",
  "release",
  "introduce",
  "announc",
  "agent",
  "reasoning",
  "multimodal",
  "video",
  "voice",
  "enterprise",
  "developer",
  "coding",
  "open source",
  "safety",
  "policy",
  "claude",
  "gemini",
  "chatgpt",
  "openai",
  "research",
  "benchmark",
  "发布",
  "推出",
  "开源",
  "智能体",
  "agent",
  "大模型",
  "多模态",
  "机器人",
  "推理",
  "企业",
  "办公",
  "编程",
  "安全",
  "监管",
  "研究"
];

const audienceRules: Array<{ audience: Audience; terms: string[] }> = [
  { audience: "程序员", terms: ["developer", "coding", "code", "github", "api", "open source", "programming"] },
  { audience: "创作者", terms: ["video", "image", "voice", "audio", "creative", "creator", "multimodal", "content"] },
  { audience: "企业管理者", terms: ["enterprise", "business", "workflow", "office", "productivity", "security"] },
  { audience: "教师", terms: ["education", "teaching", "student", "learning", "classroom"] },
  { audience: "投资研究者", terms: ["funding", "market", "chip", "nvidia", "revenue", "policy", "regulation"] },
  { audience: "打工人", terms: ["agent", "office", "workflow", "productivity", "assistant", "meeting"] }
];

export async function getDailyBriefing() {
  const entries = await fetchFeedEntries();
  const ranked = entries.map(rankEntry).sort((a, b) => b.score - a.score);
  const filtered = ranked.filter((entry) => isAiRelated(entry));
  const selected = fillWithFallback(dedupeEntries(filtered).slice(0, 5));

  return {
    date: formatToday(),
    items: selected.map(toBriefingItem),
    trends: buildTrends(selected)
  };
}

async function fetchFeedEntries() {
  const settled = await Promise.allSettled(sourceFeeds.map(fetchSourceFeed));
  return settled
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((entry) => entry.title && entry.link);
}

async function fetchSourceFeed(source: SourceFeed): Promise<FeedEntry[]> {
  const response = await fetch(source.url, {
    next: { revalidate: 60 * 60 },
    headers: {
      "User-Agent": "AI Frontier Briefing/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.name}`);
  }

  const xml = await response.text();
  return parseFeed(xml, source).slice(0, 12);
}

function parseFeed(xml: string, source: SourceFeed): FeedEntry[] {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];

  return blocks.map((block) => {
    const link = getTag(block, "link") || getAtomLink(block);

    return {
      title: cleanText(getTag(block, "title")),
      description: cleanText(getTag(block, "description") || getTag(block, "summary") || getTag(block, "content:encoded")),
      link,
      publishedAt: getTag(block, "pubDate") || getTag(block, "published") || getTag(block, "updated"),
      source
    };
  });
}

function getTag(block: string, tag: string) {
  const escapedTag = tag.replace(":", "\\:");
  const match = block.match(new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, "i"));
  return decodeEntities(match?.[1]?.replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() ?? "");
}

function getAtomLink(block: string) {
  const href = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1];
  return decodeEntities(href ?? "");
}

function rankEntry(entry: FeedEntry): RankedEntry {
  const text = `${entry.title} ${entry.description}`.toLowerCase();
  const keywordScore = scoreKeywords.reduce((total, keyword) => total + (text.includes(keyword) ? 8 : 0), 0);
  const recencyScore = getRecencyScore(entry.publishedAt);
  const chineseScore = /[\u4e00-\u9fff]/.test(`${entry.title}${entry.description}`) ? 10 : 0;
  const score = entry.source.weight + keywordScore + recencyScore + chineseScore;

  return {
    ...entry,
    score,
    level: score >= 82 ? "S" : score >= 58 ? "A" : "B",
    audience: inferAudience(text),
    reason: buildReason(text, entry.source.name)
  };
}

function isAiRelated(entry: FeedEntry) {
  const text = `${entry.title} ${entry.description}`.toLowerCase();
  return aiKeywords.some((keyword) => text.includes(keyword));
}

function getRecencyScore(dateText: string) {
  const timestamp = Date.parse(dateText);
  if (Number.isNaN(timestamp)) {
    return 8;
  }

  const ageInDays = (Date.now() - timestamp) / 86_400_000;
  if (ageInDays <= 2) return 24;
  if (ageInDays <= 7) return 16;
  if (ageInDays <= 30) return 8;
  return 0;
}

function inferAudience(text: string): Audience[] {
  const matched = audienceRules.filter((rule) => rule.terms.some((term) => text.includes(term))).map((rule) => rule.audience);
  const unique = Array.from(new Set(matched)).slice(0, 3);
  return unique.length ? unique : ["打工人"];
}

function buildReason(text: string, sourceName: string) {
  if (text.includes("agent") || text.includes("workflow") || text.includes("office")) {
    return "它可能把 AI 从聊天工具推向真实工作流，值得尽早观察。";
  }

  if (text.includes("developer") || text.includes("coding") || text.includes("github") || text.includes("api")) {
    return "它会直接影响开发效率和产品接入方式，技术团队需要跟进。";
  }

  if (text.includes("video") || text.includes("image") || text.includes("voice") || text.includes("multimodal")) {
    return "它正在改变内容生产门槛，创作和营销流程会最先被影响。";
  }

  if (text.includes("enterprise") || text.includes("security") || text.includes("business")) {
    return "它说明 AI 正在进入组织级应用，影响采购、治理和管理决策。";
  }

  if (text.includes("safety") || text.includes("policy") || text.includes("regulation")) {
    return "它关系到 AI 能否被更大范围采用，长期影响不小。";
  }

  return `来自 ${sourceName} 的新动向，可能影响下一阶段 AI 产品和应用方向。`;
}

function dedupeEntries(entries: RankedEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    const key = entry.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "").slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function fillWithFallback(entries: RankedEntry[]) {
  if (entries.length >= 5) {
    return entries.slice(0, 5);
  }

  const fallback = dailyBriefing.items.slice(0, 5 - entries.length).map((item) => ({
    title: item.title,
    description: item.summary,
    link: item.sourceUrl,
    publishedAt: new Date().toISOString(),
    source: { id: "fallback", name: "本地备用", url: item.sourceUrl, weight: 0 },
    score: 0,
    level: item.level,
    audience: item.audience,
    reason: item.reason
  }));

  return entries.concat(fallback);
}

function toBriefingItem(entry: RankedEntry, index: number): BriefingItem {
  return {
    id: `${entry.source.id}-${index}-${slugify(entry.title)}`,
    title: cutText(entry.title, 42),
    summary: cutText(entry.description || entry.title, 30),
    level: entry.level,
    audience: entry.audience,
    reason: entry.reason,
    sourceUrl: entry.link
  };
}

function buildTrends(entries: RankedEntry[]) {
  const text = entries.map((entry) => `${entry.title} ${entry.description}`.toLowerCase()).join(" ");
  const trends: string[] = [];

  if (text.includes("agent") || text.includes("workflow")) {
    trends.push("AI Agent 正在从概念走向实际办公流程");
  }
  if (text.includes("enterprise") || text.includes("security") || text.includes("business")) {
    trends.push("企业级 AI 应用开始更重视安全、治理和落地效率");
  }
  if (text.includes("video") || text.includes("image") || text.includes("voice") || text.includes("multimodal")) {
    trends.push("多模态生成工具开始影响内容生产");
  }
  if (text.includes("developer") || text.includes("coding") || text.includes("github")) {
    trends.push("AI 编程工具正在从补全走向项目级协作");
  }
  if (text.includes("chip") || text.includes("nvidia") || text.includes("infrastructure")) {
    trends.push("算力与基础设施仍是 AI 竞争的关键变量");
  }

  return [...trends, ...dailyBriefing.trends].filter((trend, index, list) => list.indexOf(trend) === index).slice(0, 3);
}

function cleanText(value: string) {
  return decodeEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-");
}

function cutText(value: string, maxLength: number) {
  const text = value.trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 48);
}

function formatToday() {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());
}
