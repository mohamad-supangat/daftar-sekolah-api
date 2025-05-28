import { color } from "bun";
import db from "../db";
import { isEmpty } from "../helpers";
import { Sekolah } from "../types";

const rows = db.tables["sekolah"].find();
const results: Sekolah[] = [];
let index = 0;
for (const row of rows) {
  const resultIndex = results.findIndex((x) => x.nama == row.nama);
  if (resultIndex == -1) {
    results.push(row);
  } else {
    let result = results[resultIndex];
    for (const column of ["nama", "alamat", "npsn", "status"]) {
      if (!isEmpty(row[column])) {
        result[column] = row[column];
      }
    }
    results[resultIndex] = result;
  }

  if (index++ == 20) {
    break;
  }
}
console.log(results);
