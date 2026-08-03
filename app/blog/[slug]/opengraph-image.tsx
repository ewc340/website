import { ImageResponse } from "next/og";

import { getPostBySlug } from "@/lib/content/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a2e",
            color: "#fff",
            fontSize: 48,
          }}
        >
          Post not found
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)",
          color: "#fff",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#a78bfa",
          }}
        >
          {post.category}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 600,
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            {post.title}
          </div>
          <div style={{ fontSize: 24, color: "#c4b5fd", maxWidth: 800 }}>
            {post.excerpt}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
