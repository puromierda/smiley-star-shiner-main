import type { CategoryKey, SkinType } from './skin-guide'

export type RoutineStep = { step: string; product: string; ingredients: string; how: string }

export type SkinAnalysis = {
  isFace: boolean;
  skinType: SkinType;
  categories: CategoryKey[];
  summary: string;
  photoQuality: 'buena' | 'aceptable' | 'baja';
  concerns: { name: string; level: 'leve' | 'moderado' | 'marcado'; text: string }[];
  mainNeed: { title: string; text: string };
  morning: RoutineStep[];
  night: RoutineStep[];
  weekly: RoutineStep[];
  tips: string[];
  medicalNote: string | null;
};
