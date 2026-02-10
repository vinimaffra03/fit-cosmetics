import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fitcosmetics.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/", "/minha-conta/", "/meus-pedidos/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
