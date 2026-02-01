import React, { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // This event only fires when Chrome considers the site installable (real app)
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const onInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    // After prompting, Chrome consumes the event
    setDeferredPrompt(null);
  };

  // If Chrome doesn't consider it installable yet, show nothing
  if (!deferredPrompt) return null;

  return (
    <button
      onClick={onInstall}
      className="px-4 py-2 rounded-xl text-xs font-black shadow-sm"
      style={{ backgroundColor: "#0f172a", color: "white" }}
    >
      Install App
    </button>
  );
}
