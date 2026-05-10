export type SourceFeed = {
  id: string;
  name: string;
  url: string;
  weight: number;
};

export const sourceFeeds: SourceFeed[] = [
  {
    id: "qbitai",
    name: "量子位",
    url: "https://www.qbitai.com/feed",
    weight: 42
  },
  {
    id: "infoq",
    name: "InfoQ",
    url: "https://www.infoq.cn/feed",
    weight: 34
  },
  {
    id: "36kr",
    name: "36氪",
    url: "https://www.36kr.com/feed",
    weight: 28
  },
  {
    id: "geekpark",
    name: "极客公园",
    url: "https://www.geekpark.net/rss",
    weight: 28
  },
  {
    id: "openai",
    name: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    weight: 42
  },
  {
    id: "venturebeat-ai",
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    weight: 28
  },
  {
    id: "the-verge-ai",
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    weight: 26
  },
  {
    id: "mit-tech-review",
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    weight: 24
  },
  {
    id: "github-ai",
    name: "GitHub AI & ML",
    url: "https://github.blog/ai-and-ml/feed/",
    weight: 30
  },
  {
    id: "microsoft-ai",
    name: "Microsoft AI",
    url: "https://blogs.microsoft.com/ai/feed/",
    weight: 30
  },
  {
    id: "nvidia",
    name: "NVIDIA Blog",
    url: "https://blogs.nvidia.com/feed/",
    weight: 26
  }
];
