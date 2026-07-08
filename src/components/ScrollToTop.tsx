"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollResetter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Desactiva el scroll restoration automático del browser/Next.js
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, searchParams]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense>
      <ScrollResetter />
    </Suspense>
  );
}
