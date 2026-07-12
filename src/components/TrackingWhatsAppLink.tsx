"use client";

import { usePostHog } from "posthog-js/react";
import { gtagEvent } from "@/lib/gtag";

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
  eventName?: string;
  trackAds?: boolean;
}

export default function TrackingWhatsAppLink({ href, className, children, eventName = "whatsapp_clicked", trackAds = true }: Props) {
  const posthog = usePostHog();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        posthog?.capture(eventName);
        if (trackAds) {
          gtagEvent("contact", { method: "WhatsApp" });
          window.gtag?.("event", "conversion", { send_to: "AW-18306929852/NVb1CI6Ess4cELyptplE" });
        }
      }}
    >
      {children}
    </a>
  );
}
