import type { MetadataRoute } from "next";
import { publicReports } from "@/data/reports";

const baseUrl = "https://www.ohrly.com.br";
const locales = ["pt", "en"];
const staticRoutes = ["", "/ecommerce", "/studies", "/diagnostic", "/contact", "/partners", "/prices"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" || route === "/ecommerce" ? 1 : route === "/studies" ? 0.9 : 0.7,
    })),
  );

  const reportUrls = locales.flatMap((locale) =>
    publicReports.map((report) => ({
      url: `${baseUrl}/${locale}/reports/${report.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticUrls, ...reportUrls];
}
