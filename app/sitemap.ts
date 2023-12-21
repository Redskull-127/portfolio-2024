import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.meertarbani.in",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: "https://www.meertarbani.in/about",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: "https://www.meertarbani.in/blog",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.meertarbani.in/chat",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.meertarbani.in/events",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.meertarbani.in/projects",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.5,
    },
  ];
}
