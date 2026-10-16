import { describe, expect, it } from "vitest";

import {
  categoryName,
  normalizeCategories,
  normalizeSkinAnalysis,
  normalizeSkinType,
  SKIN_CATEGORIES,
} from "@/lib/skin-guide";

const KEYS = ["grasa", "seca", "mixta", "sensible", "acne", "manchas"];

describe("Categorías de piel", () => {
  it("tiene las seis categorías pedidas, cada una con rutina de mañana, noche y semana", () => {
    expect(SKIN_CATEGORIES.map((c) => c.key)).toEqual(KEYS);
    for (const c of SKIN_CATEGORIES) {
      expect(c.routine.morning.length).toBeGreaterThanOrEqual(3);
      expect(c.routine.night.length).toBeGreaterThanOrEqual(3);
      expect(c.routine.weekly.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("toda rutina de mañana termina en protector solar", () => {
    for (const c of SKIN_CATEGORIES) {
      expect(c.routine.morning.at(-1)?.product.toLowerCase()).toContain("protector solar");
    }
  });

  it("reconoce el tipo de piel escrito de distintas formas", () => {
    expect(normalizeSkinType("Piel Mixta")).toBe("mixta");
    expect(normalizeSkinType("GRASA")).toBe("grasa");
    expect(normalizeSkinType("sebo")).toBe("normal");
  });

  it("filtra categorías desconocidas, no repite y deja máximo 3", () => {
    expect(normalizeCategories(["acne", "Acné", "acne", "manchas", "rosácea", "grasa", "seca"])).toEqual([
      "acne",
      "manchas",
      "grasa",
    ]);
    expect(normalizeCategories("acne")).toEqual([]);
  });

  it("completa los valores que la IA podría devolver faltantes", () => {
    const analysis = normalizeSkinAnalysis({
      isFace: true,
      skinType: "mixta",
      categories: ["mixta", "acne"],
      photoQuality: "regular",
    });
    expect(analysis.photoQuality).toBe("aceptable");
    expect(analysis.concerns).toEqual([]);
    expect(analysis.morning).toEqual([]);
    expect(analysis.medicalNote).toBeNull();
    expect(categoryName("acne")).toBe("Con acné");
  });
});
