import { createFileRoute } from "@tanstack/react-router";
import SelemApp from "@/components/SelemApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Selem Beauty — Escaneo facial con IA" },
      { name: "description", content: "Escanea tu piel con una selfie y recibe tu tipo de piel, necesidades y una rutina personalizada con IA." },
      { property: "og:title", content: "Selem Beauty — Escaneo facial con IA" },
      { property: "og:description", content: "Escanea tu piel con una selfie y recibe tu tipo de piel, necesidades y una rutina personalizada con IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SelemApp,
});
