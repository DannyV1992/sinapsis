export const GA_MEASUREMENT_ID = "G-YMZ7VT90T3";

export function gtagEvent(action: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
}
