import { fetch } from "bun";
import { DataResult } from "./types";
export default async function fetcher(
  searchQuery: string,
): Promise<DataResult[]> {
  try {
    const sekolahList = await fetch(
      "https://dapo.dikdasmen.go.id/api/getHasilPencarian?keyword=ajibarang",
      {
        credentials: "include",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "X-Requested-With": "XMLHttpRequest",
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Priority: "u=0",
        },
        referrer: "https://dapo.dikdasmen.go.id/pencarian",
        method: "GET",
        mode: "cors",
      },
    ).then(async (x) => await x.json());

    return sekolahList.map((x: any): DataResult => {
      return {
        nama: x.nama_sekolah,
        status: x.status,
        npsn: x.npsn,
        alamat: `${x.alamat_jalan} ${x.kecamatan}, ${x.kabupaten} ${x.propinsi}`,
      };
    });
  } catch (e) {
    console.log(`error ketika menghubungi host: ${provider?.url} `);
    return [];
  }
}
