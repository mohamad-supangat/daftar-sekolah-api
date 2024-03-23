"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const cheerio = require("cheerio");
app.use(cors());
const PORT = process.env.PORT || 3000;
const api_url = "https://referensi.data.kemdikbud.go.id/pendidikan/cari";
function removeAfterString(str, target) {
    const index = str.lastIndexOf(target);
    if (index !== -1) {
        return str.slice(0, index);
    }
    else {
        return str;
    }
}
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const keyword = (_a = req.query.q) !== null && _a !== void 0 ? _a : null;
    console.log(`${api_url}/${keyword}`);
    if (keyword == null) {
        res.send("ERROR: query param `keyword` is required");
    }
    else {
        const response = yield axios
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
        let javascriptCode = $(".body-inner > div:nth-child(3) > script:nth-child(12)").text();
        javascriptCode = javascriptCode.replace("$(document).ready(function() {", "");
        javascriptCode = removeAfterString(javascriptCode, ` $('#table1').DataTable({`);
        eval(javascriptCode);
        let results = [];
        for (const row of data) {
            const $npsn = cheerio.load(row[1].toString());
            results.push({
                nama: row[2],
                status: row[5],
                npsn: $npsn.text(),
                alamat: `${row[3]}, ${row[4]}`,
            });
        }
        res.json(results);
    }
}));
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});
