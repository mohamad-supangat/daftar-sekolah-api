import { fetch } from "bun";
import { DataResult } from "./types";
import { load as cheerioLoad } from "cheerio";
import { result } from "lodash";
export default async function fetcher(
  searchQuery: string,
): Promise<DataResult[]> {
  try {
    const response = await fetch(
      `https://daftarsekolah.net/cari?q=${searchQuery}`,
      {
        credentials: "omit",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Sec-GPC": "1",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-User": "?1",
          Priority: "u=0, i",
        },
        referrer: "https://daftarsekolah.net/",
        method: "GET",
        mode: "cors",
      },
    ).then(async (x) => await x.text());

    // console.log(response);
    const $ = cheerioLoad(response);

    const keys = ["no", "nama", "npsn"];
    let results: DataResult[] = [];

    const tr = $(".si");

    if (!!tr.length) {
      tr.each((number, row) => {
        const result: DataResult = {
          nama: $(row).find("h2").text(),
          alamat: $(row).find(".sd p").text(),
        };

        if (result.nama) {
          results.push({
            nama: result.nama,
            npsn: result.npsn,
          });
        }
      });

      return results;
    }

    return results;
  } catch (e) {
    console.log(`error ketika menghubungi host`, e);
    return [];
  }
}
