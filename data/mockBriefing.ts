export type ImportanceLevel = "S" | "A" | "B";

export type Audience =
  | "打工人"
  | "创作者"
  | "程序员"
  | "教师"
  | "企业管理者"
  | "投资研究者";

export type BriefingItem = {
  id: string;
  title: string;
  summary: string;
  level: ImportanceLevel;
  audience: Audience[];
  reason: string;
  sourceUrl: string;
};

export type DailyBriefing = {
  date: string;
  items: BriefingItem[];
  trends: string[];
};

export const dailyBriefing: DailyBriefing = {
  date: "2026年5月11日",
  items: [
    {
      id: "agent-office-workflow",
      title: "主流 AI Agent 开始进入办公自动化流程",
      summary: "从聊天助手转向可执行任务的工作代理。",
      level: "S",
      audience: ["打工人", "企业管理者", "程序员"],
      reason: "它会改变日常协作方式，最先影响资料整理、会议跟进和轻量运营。",
      sourceUrl: "https://openai.com/news/"
    },
    {
      id: "domestic-model-enterprise",
      title: "国产大模型加速落地政企知识库场景",
      summary: "企业私有数据问答成为重点落地入口。",
      level: "A",
      audience: ["企业管理者", "投资研究者"],
      reason: "这说明模型竞争正在从参数转向交付能力和行业数据整合。",
      sourceUrl: "https://www.miit.gov.cn/"
    },
    {
      id: "multimodal-creator-tools",
      title: "多模态生成工具继续降低内容制作门槛",
      summary: "图片、视频、语音链路进一步打通。",
      level: "A",
      audience: ["创作者", "教师"],
      reason: "内容团队会更快进入小规模自动化生产，个人创作者也能做出更完整作品。",
      sourceUrl: "https://research.google/blog/"
    },
    {
      id: "ai-coding-review",
      title: "AI 编程助手从补全转向代码审查与修复",
      summary: "开发工具更重视理解项目上下文。",
      level: "A",
      audience: ["程序员", "企业管理者"],
      reason: "真正的效率提升来自减少返工，而不只是更快写出第一版代码。",
      sourceUrl: "https://github.blog/"
    },
    {
      id: "education-ai-policy",
      title: "教育场景开始明确 AI 辅助使用边界",
      summary: "课堂、作业和评估规则正在重写。",
      level: "B",
      audience: ["教师", "投资研究者"],
      reason: "它决定了 AI 工具能否进入长期稳定的学习流程，而不只是课外尝鲜。",
      sourceUrl: "https://www.unesco.org/en/artificial-intelligence"
    }
  ],
  trends: [
    "AI Agent 正在从概念走向实际办公流程",
    "国产大模型正在加速进入政企场景",
    "多模态生成工具开始影响内容生产"
  ]
};
