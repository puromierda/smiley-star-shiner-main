import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const analyzeSkin = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ image: z.string().startsWith("data:image/").max(8_000_000) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { runSkinAnalysis } = await import("./skin.server");
    try {
      return { ok: true as const, analysis: await runSkinAnalysis(data.image) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Error inesperado" };
    }
  });
