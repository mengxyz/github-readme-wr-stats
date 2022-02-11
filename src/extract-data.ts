import cheerio from "cheerio";
import puppeteer from "puppeteer";

function extractPlayerInfo(html: string): PlayerInfo {
  const $ = cheerio.load(html);
  const name = $("#playerName").text();
  const tag = $("#playerTag").text();
  const level = $(".profile-level").first().text().split(" ")[1].trim();
  const rankContainer = $($(".profile-header > div").toArray()[1]);
  const rankLogoUrl = $(rankContainer).find("img").first().attr("src") ?? "";
  const rankTitle = $(rankContainer).find("span").first().text();

  return <PlayerInfo>{
    name: name,
    tag: tag,
    level: level,
    rank: <Rank>{
      logoUrl: rankLogoUrl,
      title: rankTitle,
    },
  };
}

async function extractBattleStats(html: string): Promise<BattleStats> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.setContent(html);
    const winRate = await page.$eval(
      "#battleStats_WinRate",
      (el) => el.innerHTML
    );
    const tp = await page.$eval("#battleStats_Teamfight", (el) => el.innerHTML);
    const kda = await page.$eval("#battleStats_Kda", (el) => el.innerHTML);
    const gp = await page.$eval(
      "#battleStats_GoldPerMinute",
      (el) => el.innerHTML
    );
    const add = await page.$eval(
      "#battleStats_DamageDealt",
      (el) => el.innerHTML
    );
    const adt = await page.$eval(
      "#battleStats_DamageTaken",
      (el) => el.innerHTML
    );
    const atd = await page.$eval(
      "#battleStats_DamageDealtToTowers",
      (el) => el.innerHTML
    );
    const mvp = await page.$eval("#battleStats_MVP", (el) => el.innerHTML);
    const played = await page.$eval(
      "#battleStats_Played",
      (el) => el.innerHTML
    );
    return <BattleStats>{
      winratte: winRate,
      tp: Number.parseFloat(tp),
      kdaAvg: Number.parseFloat(kda),
      gpm: Number.parseInt(gp.replace(/,/g, "")),
      add: Number.parseInt(add.replace(/,/g, "")),
      adt: Number.parseInt(adt.replace(/,/g, "")),
      atd: Number.parseInt(atd.replace(/,/g, "")),
      mvp: mvp,
      played: played,
    };
  } catch (error) {
    throw Error("Page not found");
  } finally {
    await page.close();
    await browser.close();
  }
}

export { extractPlayerInfo, extractBattleStats };
