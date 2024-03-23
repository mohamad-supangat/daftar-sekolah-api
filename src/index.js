require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const cheerio = require("cheerio");

app.use(cors());

// get from env
const PORT = process.env.PORT || 3000;

const api_url = "https://referensi.data.kemdikbud.go.id/pendidikan/cari";

function removeAfterString(str, target) {
  const index = str.lastIndexOf(target);
  if (index !== -1) {
    return str.slice(0, index); // Extract up to the target string
  } else {
    // Target string not found, return the original string
    return str;
  }
}
app.get("/", async (req, res) => {
  const keyword = req.query.q ?? null;

  console.log(`${api_url}/${keyword}`);
  if (keyword == null) {
    res.send("ERROR: query param `keyword` is required");
  } else {
    const response = await axios
      .get(`${api_url}/${keyword}`)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        res.send({
          status: "500",
          message: error,
        });
      });

    const $ = cheerio.load(response.data);
    let javascriptCode = $(
      ".body-inner > div:nth-child(3) > script:nth-child(12)",
    ).text();

    javascriptCode = javascriptCode.replace(
      "$(document).ready(function() {",
      "",
    );

    javascriptCode = removeAfterString(
      javascriptCode,
      ` $('#table1').DataTable({`,
    );

    // console.log(javascriptCode);

    eval(javascriptCode);

    let results = [];
    for (const row of data) {
      const $npsn = cheerio.load(row[1].toString());
      // console.log($npsn.text());

      results.push({
        nama: row[2],
        status: row[5],
        npsn: $npsn.text(),
        alamat: `${row[3]}, ${row[4]}`,
      });
    }

    res.json(results);
  }
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
