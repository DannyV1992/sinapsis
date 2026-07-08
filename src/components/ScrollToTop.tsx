"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollResetter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Si la URL tiene un anchor (#section), dejar que el browser maneje el scroll
    if (window.location.hash) return;

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
