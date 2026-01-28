export default {
  async fetch(request) {
    const country = request.cf?.country || "UN";

    const target =
      country === "CN"
        ? "https://cn.ich.cc.cd"
        : "https://www.ich.cc.cd";

    return Response.redirect(target, 302);
  }
};
