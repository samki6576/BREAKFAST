export type AnalyticsEvent =
  | { type: "session_start" }
  | { type: "level_start"; levelId: number }
  | { type: "level_end"; levelId: number; result: "won" | "lost"; score: number }
  | { type: "purchase"; itemId: string; amount: number }
  | { type: "powerup"; key: string }

export function track(event: AnalyticsEvent) {
  try {
    // Console log for dev visibility
    // eslint-disable-next-line no-console
    console.log("[analytics]", event)

    const gaId = process.env.NEXT_PUBLIC_GA_ID
    if (typeof window !== "undefined" && gaId && (window as any).gtag) {
      switch (event.type) {
        case "session_start":
          ;(window as any).gtag("event", "session_start")
          break
        case "level_start":
          ;(window as any).gtag("event", "level_start", { level_id: event.levelId })
          break
        case "level_end":
          ;(window as any).gtag("event", "level_end", {
            level_id: event.levelId,
            result: event.result,
            score: event.score,
          })
          break
        case "purchase":
          ;(window as any).gtag("event", "purchase", { item_id: event.itemId, value: event.amount })
          break
        case "powerup":
          ;(window as any).gtag("event", "powerup", { key: event.key })
          break
      }
    }
  } catch {}
}


