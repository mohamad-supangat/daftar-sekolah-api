import { BunORM } from "bunorm";
import { Database } from "bun:sqlite";
export const dbRaw = new Database("db.sqlite");
const db = new BunORM("db.sqlite", {
  tables: {
    sekolah: {
      columns: {
        nama: {
          type: "TEXT",
        },
        status: {
          type: "TEXT",
        },
        npsn: {
          type: "TEXT",
        },
        alamat: {
          type: "TEXT",
        },
      },
    },
  },
});

export default db;
