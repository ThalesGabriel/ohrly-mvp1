import type { ComponentType } from "react";
import type { StudyDetail } from "@/data/studies";
import { V4StudyDetail } from "./V4StudyDetail";

export const customStudyComponents: Record<
  string,
  ComponentType<{ study: StudyDetail }>
> = {
  V4StudyDetail,
};