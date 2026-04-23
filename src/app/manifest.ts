import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kanishk Srivastava",
    short_name: "KS",
    description: "Portfolio of Kanishk Srivastava, a creative technologist.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9F7F4",
    theme_color: "#0C0C0B",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
