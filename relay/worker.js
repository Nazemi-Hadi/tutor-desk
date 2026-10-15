// Tutor Desk calendar relay (Cloudflare Worker).
//
// Outlook publishes calendars as ICS links but doesn't let other websites read them
// from the browser. This worker fetches the link on the app's behalf and hands the
// calendar back. It stores nothing: the app sends the link in each request body.
//
// Only the Tutor Desk site may call it, and it only fetches Outlook calendar links.

const ALLOWED_ORIGINS = ["https://nazemi-hadi.github.io", "http://localhost:8765"];
const OUTLOOK_HOSTS = /^(outlook\.office365\.com|outlook\.office\.com|outlook\.live\.com)$/i;

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") {
      return new Response("Tutor Desk calendar relay is running.", { headers: { ...cors, "Content-Type": "text/plain" } });
    }
    if (!allowed) return new Response("Forbidden", { status: 403, headers: cors });

    let url;
    try {
      const body = await request.json();
      url = new URL(String(body.url || "").trim().replace(/^webcals?:\/\//i, "https://"));
    } catch (e) {
      return new Response("Send {\"url\": \"<calendar link>\"}", { status: 400, headers: cors });
    }
    if (url.protocol !== "https:" || !OUTLOOK_HOSTS.test(url.hostname)) {
      return new Response("Only Outlook calendar links are allowed", { status: 400, headers: cors });
    }

    try {
      const upstream = await fetch(url.toString(), { headers: { "User-Agent": "TutorDesk-Relay/1.0" } });
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { ...cors, "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-store" },
      });
    } catch (e) {
      return new Response("Couldn't reach Outlook", { status: 502, headers: cors });
    }
  },
};
