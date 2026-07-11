export const GA_MEASUREMENT_ID = "G-1F00E5F123";

export function gtagEvent(action: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
}
