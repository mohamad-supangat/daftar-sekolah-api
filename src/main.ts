import { serve } from "bun";
import syncDb from "./syncDb";
import fetcher from "./fetcher";
const port = process.env.PORT || 3000;

serve({
  idleTimeout: 100,
  port,
  development: true,
  async fetch(req) {
    const currentUrl = new URL(req.url);
    if (currentUrl.pathname == "/") {
      const searchQuery = currentUrl.searchParams.get("q");
      if (searchQuery == null) {
        return Response.redirect("https://s.id/aurakomputer");
      }

      let sekolahList = await fetcher(searchQuery);
      sekolahList = syncDb(searchQuery, sekolahList);
      return Response.json(sekolahList, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      });
    }
    return Response.redirect("https://s.id/aurakomputer");
  },
});

console.log(`listening on ${port}`);
