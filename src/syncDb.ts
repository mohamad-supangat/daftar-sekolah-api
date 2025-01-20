import type { DataResult } from "./types";
import db from "./db";
import { each } from "lodash";
import { dbRaw } from "./db";

export default function syncDb(
  searchQuery: string,
  sekolahList: DataResult[],
): DataResult[] {
  each(sekolahList, (sekolah) => {
    if (!sekolah) return;
    const check = db.tables["sekolah"].findBy(sekolah as object);
    if (check.length > 0) {
      return;
    }

    db.tables["sekolah"].save({
      nama: sekolah.nama || "",
      status: sekolah.status || "",
      npsn: sekolah.npsn || "",
      alamat: sekolah.alamat || "",
    });
  });

  if (sekolahList.length > 0) {
    return sekolahList;
  } else {
    const sekolah = dbRaw
      .query(
        `
      SELECT *
      FROM sekolah
      WHERE
        nama LIKE '%${searchQuery}%'
        OR alamat LIKE '%${searchQuery}%'
        OR nps LIKE '%${searchQuery}%'
        OR status LIKE '%${searchQuery}%'
      `,
      )
      .all();

    return sekolah as DataResult[];
  }
}
