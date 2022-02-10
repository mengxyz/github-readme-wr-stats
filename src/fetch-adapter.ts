import axios from "axios";
import cheerio from "cheerio";

import { BASE_API_ENDPOINT } from "./constant";

async function getUserStatsPlain(
  profile: string,
  font_color: string,
  max: number,
  win_color: string,
  lose_color: string
): Promise<string> {
  try {
    const result = await axios.get(`${BASE_API_ENDPOINT}${profile}`);
    return historyTable(result.data, font_color, max, win_color, lose_color);
  } catch (error) {
    return "error";
  }
}

async function imgToBase64(url: string): Promise<string> {
  const result = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const buff = Buffer.from(result.data, "binary").toString("base64");
  return buff;
}

async function historyTable(
  html: string,
  font_color: string,
  max: number,
  win_color: string,
  lose_color: string
): Promise<string> {
  const doc = cheerio.load(html);
  const trs = doc("tbody > tr").toArray().slice(0, max);

  const profiles = await Promise.all(
    trs.map(async (tr, i) => {
      const tds = doc(tr).find("td").toArray();
      const champUrl =
        doc(tds[0]).find("img").first().attr("src")?.toString() ?? "";

      const img = `<image xlink:href="data:image/png;base64,${await imgToBase64(
        champUrl
      )}" x="10" y="${i * 50}" width='40px' hight='40px' />`;
      return img;
    })
  );

  // const items = await Promise.all(
  //   trs.map(async (tr, i) => {
  //     const tds = doc(tr).find("td").toArray();
  //     const itemsbase64 = await Promise.all(
  //       doc(tds[1])
  //         .find(".battle-log-items > img")
  //         .toArray()
  //         .map(
  //           async (e) => await imgToBase64(doc(e).attr("src")?.toString() ?? "")
  //         )
  //     );

  //     const items = itemsbase64.map((e, ie) => {
  //       return `<image xlink:href="data:image/png;base64,${e}" x="${
  //         ie == 0 ? 60 : ie * 20 + 60
  //       }" y="${i * 50 + 24}" width='16px' hight='16px' />`;
  //     });
  //     return items.join("");
  //   })
  // );

  const KDA = await Promise.all(
    trs.map(async (tr, i) => {
      const tds = doc(tr).find("td").toArray();
      const itemsbase64 = doc(tds[1])
        .find(".battle-log-stats > .battle-log-stats-item > div")
        .toArray()
        .slice(0, 6)
        .map((e) => doc(e).text().trim());

      const items = itemsbase64.map((e, ie) => {
        return `<text x="${ie == 0 ? 60 : ie * 20 + 60}" y="${
          i * 50 + 35
        }">${e}</text>`;
      });
      return items.join("");
    })
  );

  const status = await Promise.all(
    trs.map(async (tr, i) => {
      const tds = doc(tr).find("td").toArray();
      const itemsbase64 = doc(tds[2])
        .toArray()
        .map((e) => doc(e).text().trim());

      const items = itemsbase64.map((e, ie) => {
        return `<text class="status ${
          e.toLowerCase() == "win" ? "win" : "lose"
        }" x="${ie == 0 ? 200 : ie * 20 + 200}" y="${
          i * 50 + 35
        }" width='16px' hight='16px'>${e}</text>`;
      });
      return items.join("");
    })
  );

  const out = `
  <svg width="300px" height="${50 * max}px" version="1.1"
  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <style>
    text {
      font: bold 40px monospace;
      fill: ${font_color};
    }
    .win {
      fill: ${win_color};
    }
    .lose {
      fill: ${lose_color};
    }
  </style>
   ${profiles.join("")}
   ${KDA.join("")}
   ${status.join("")}
  </svg>
  `;

  console.log(KDA.join(""));

  return out;
}

export { getUserStatsPlain };
