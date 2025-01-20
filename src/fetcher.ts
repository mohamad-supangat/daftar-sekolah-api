import { fetch } from "bun";
import { DataResult } from "./types";
import { load as cheerioLoad } from "cheerio";
import { result } from "lodash";
export default async function fetcher(
  searchQuery: string,
): Promise<DataResult[]> {
  try {
    const response = await fetch(
      `https://referensi.data.kemdikbud.go.id/residu/carisekolah/${searchQuery}`,
      {
        credentials: "include",
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
        referrer:
          "https://referensi.data.kemdikbud.go.id/residu/carisekolah/ajibarang",
        method: "GET",
        mode: "cors",
      },
    ).then(async (x) => await x.text());

    const $ = cheerioLoad(response);

    const keys = ["no", "nama", "npsn"];
    let results: DataResult[] = [];

    const tr = $("tr");

    if (!!tr.length) {
      tr.each((number, row) => {
        if (number === 0) return;

        const td = $(row).find("td");
        const result: DataResult = {};

        td.each((index, data) => {
          const value = $(data).text().trim();
          result[keys[index]] = value;
        });

        if (result.nama) {
          results.push({
            nama: result.nama,
            npsn: result.npsn,
          });
        }
      });

      console.log(results);

      return results;
    }

    return results;
  } catch (e) {
    console.log(`error ketika menghubungi host`, e);
    return [];
  }
}
