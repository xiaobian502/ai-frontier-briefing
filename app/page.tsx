import { getDailyBriefing } from "@/lib/briefing";

const levelStyles = {
  S: "border-coral/40 bg-coral/15 text-coral",
  A: "border-amber/40 bg-amber/15 text-amber",
  B: "border-mint/40 bg-mint/15 text-mint"
};

export default async function Home() {
  const dailyBriefing = await getDailyBriefing();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pb-8 pt-[max(24px,env(safe-area-inset-top))]">
      <header className="pb-6 pt-3">
        <p className="mb-3 text-sm font-medium text-mint/80">{dailyBriefing.date}</p>
        <h1 className="text-3xl font-semibold tracking-normal text-white">AI前沿情报站</h1>
        <p className="mt-3 max-w-[18rem] text-base leading-7 text-white/64">
          每天5条，抓住真正重要的AI变化
        </p>
      </header>

      <section aria-labelledby="today-heading" className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 id="today-heading" className="text-lg font-semibold text-white">
            今日重点
          </h2>
          <span className="text-xs font-medium text-white/42">精选 {dailyBriefing.items.length} 条</span>
        </div>

        {dailyBriefing.items.map((item, index) => (
          <article
            key={item.id}
            className="rounded-lg border border-line bg-white/[0.055] p-4 shadow-glow backdrop-blur"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-white/70">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${levelStyles[item.level]}`}
                  >
                    {item.level}
                  </span>
                  <span className="truncate text-xs font-medium text-white/44">{item.audience.join(" / ")}</span>
                </div>
                <h3 className="text-base font-semibold leading-6 text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.summary}</p>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-white/8 bg-black/18 p-3">
              <p className="text-xs font-medium text-white/36">一句话判断</p>
              <p className="mt-1 text-sm leading-6 text-white/72">{item.reason}</p>
            </div>

            <a
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white/10 bg-white/[0.075] px-4 text-sm font-semibold text-white transition active:scale-[0.99]"
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看原文
            </a>
          </article>
        ))}
      </section>

      <section aria-labelledby="trend-heading" className="mt-8">
        <h2 id="trend-heading" className="text-lg font-semibold text-white">
          本周趋势
        </h2>
        <div className="mt-3 space-y-2">
          {dailyBriefing.trends.map((trend) => (
            <div key={trend} className="rounded-lg border border-line bg-panel/70 px-4 py-3">
              <p className="text-sm leading-6 text-white/72">{trend}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-8 pb-[max(12px,env(safe-area-inset-bottom))] text-center">
        <p className="text-sm font-medium text-white/52">今日已筛选 {dailyBriefing.items.length} 条</p>
        <p className="mt-2 text-xs text-white/34">不是所有 AI 新闻都值得看</p>
      </footer>
    </main>
  );
}
