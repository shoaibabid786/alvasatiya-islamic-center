"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "@/lib/firebase";

export default function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    getFirebaseAnalytics().then((analytics) => {
      if (!analytics) return;
      logEvent(analytics, "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    });
  }, [pathname]);

  return null;
}
