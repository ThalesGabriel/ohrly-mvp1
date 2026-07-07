import {
  Activity,
  BarChart3,
  Clock3,
  Headphones,
  Layers3,
  MessageSquareWarning,
  ShoppingCart,
  Signal,
  type LucideIcon,
} from "lucide-react";

import type { StudyIconKey } from "./types";

export const studyIcons: Record<StudyIconKey, LucideIcon> = {
  activity: Activity,
  barChart: BarChart3,
  clock: Clock3,
  headphones: Headphones,
  layers: Layers3,
  messageWarning: MessageSquareWarning,
  shoppingCart: ShoppingCart,
  signal: Signal,
};