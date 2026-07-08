import type { ComponentType } from "react";
import type { StudyDetail } from "@/data/studies/types";
import { FounderStudyDetail } from "./FounderStudyDetail";
import { V4StudyDetail } from "./V4StudyDetail";

export const customStudyComponents: Record<
  string,
  ComponentType<{ study: StudyDetail }>
> = {
  founderStudy: FounderStudyDetail,
  V4StudyDetail
};