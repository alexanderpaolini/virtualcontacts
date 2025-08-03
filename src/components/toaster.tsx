"use client";

import { useEffect } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

function getQueryParam(param: string) {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);

  return url.searchParams.get(param);
}

function removeQueryParams(params: string[]) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  for (const param of params) {
    url.searchParams.delete(param);
  }

  window.history.replaceState({}, "", url.toString());
}

export default function Toaster() {
  useEffect(() => {
    const error = getQueryParam("error");
    if (error) {
      toast.error(decodeURIComponent(error));
    }

    const message = getQueryParam("message");
    if (message) {
      toast.success(decodeURIComponent(message));
    }

    removeQueryParams(["error", "message"]);
  }, []);

  return <SonnerToaster richColors closeButton />;
}
