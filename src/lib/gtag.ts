export const GA_MEASUREMENT_ID = "G-GE5XQ9THJS";

export function gtagEvent(action: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
}
