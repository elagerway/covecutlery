/**
 * Instagram Graph API helper.
 *
 * Fetches recent media for the configured Instagram Business Account.
 * Cached at the Next.js fetch layer for 1 hour (3600s) — IG posts are not
 * second-level fresh, and cutting the API hits keeps us well within Meta's
 * rate limits.
 *
 * Long-lived tokens last 60 days. Refresh ~50 days in via:
 *   GET https://graph.instagram.com/refresh_access_token
 *     ?grant_type=ig_refresh_token
 *     &access_token={current_long_lived_token}
 */

export interface InstagramChild {
  id: string;
  media_type: "IMAGE" | "VIDEO";
  media_url: string;
  thumbnail_url?: string;
}

export interface InstagramPost {
  id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  children?: { data: InstagramChild[] };
}

const FIELDS =
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp," +
  "children{id,media_type,media_url,thumbnail_url}";
const REVALIDATE_SECONDS = 3600; // 1 hour

export async function getInstagramFeed(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[instagram] Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID — skipping feed.");
    }
    return [];
  }

  const url =
    `https://graph.facebook.com/v21.0/${userId}/media` +
    `?fields=${FIELDS}&limit=${limit}&access_token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.error("[instagram] Graph API returned", res.status);
      return [];
    }
    const data = (await res.json()) as { data?: InstagramPost[] };
    return data.data ?? [];
  } catch (err) {
    console.error("[instagram] Fetch failed:", err);
    return [];
  }
}

/**
 * Returns the URL to use as the post's preview image.
 * Videos expose a thumbnail_url; images and carousels use media_url.
 */
export function postPreviewUrl(post: InstagramPost): string {
  if (post.media_type === "VIDEO") return post.thumbnail_url ?? post.media_url;
  return post.media_url;
}
