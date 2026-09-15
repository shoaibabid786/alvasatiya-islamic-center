"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.setTimeout(() => {
      void import("@/lib/firebase").then(({ getFirebaseAnalytics }) =>
        getFirebaseAnalytics().then((analytics) => {
          if (!analytics) return;
          return import("firebase/analytics").then(({ logEvent }) => {
            logEvent(analytics, "page_view", {
              page_path: pathname,
              page_location: window.location.href,
              page_title: document.title,
            });
          });
        }),
      );
    }, 2500);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
