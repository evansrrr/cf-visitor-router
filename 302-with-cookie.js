export default {
  async fetch(request) {
    const url = new URL(request.url);

    const cookie = request.headers.get("Cookie") || "";
    if (cookie.includes("region=cn")) {
      return Response.redirect("https://cn.example.com" + url.pathname + url.search, 302);
    }
    if (cookie.includes("region=global")) {
      return Response.redirect("https://www.example.com" + url.pathname + url.search, 302);
    }

    const country = request.cf?.country || "UN";
    const isCN = country === "CN";

    const target = isCN
      ? "https://cn.example.com"
      : "https://www.example.com";

    const headers = new Headers({
      "Set-Cookie": `region=${isCN ? "cn" : "global"}; Path=/; Max-Age=2592000`
    });

    return new Response(null, {
      status: 302,
      headers: {
        ...Object.fromEntries(headers),
        Location: target + url.pathname + url.search
      }
    });
  }
};
