import puppeteer from "puppeteer";

async function extractPlayerInfo(page: puppeteer.Page): Promise<PlayerInfo> {
  try {
    const name = await page.$eval("#playerName", (el) => el.innerHTML);
    const tag = await page.$eval("#playerTag", (el) => el.innerHTML);
    const level = await page.$eval(".profile-level", (el) =>
      el.innerHTML.split(" ")[1].trim()
    );

    const rankLogoUrl = await page.$eval(
      ".profile-header > div:nth-child(2) > img",
      (el) => el.getAttribute("src")
    );
    const rankTitle = await page.$eval(
      ".profile-header > div:nth-child(2) > span",
      (el) => el.innerHTML
    );

    return <PlayerInfo>{
      name: name,
      tag: tag,
      level: level,
      rank: <Rank>{
        logoUrl: rankLogoUrl,
        title: rankTitle,
      },
    };
  } catch (e) {
    console.log(e);
    throw Error("canot extract player info");
  }
}

async function extractBattleStats(page: puppeteer.Page): Promise<BattleStats> {
  try {
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
  }
}

async function extractMostPlayedChampions(
  page: puppeteer.Page
): Promise<Array<MostPlayedChampions>> {
  try {
    const chamCards = await page.$eval(
      "body > div:nth-child(9) > div.box_content.champion_list.pt-2",
      (el) => {
        return el.outerHTML;
      }
    );
    const champRe = /https.*.[.jpg]/gm;
    let champIcons = chamCards.match(champRe);

    const champWinRate: Array<number> = [0, 0, 0];
    for (let i = 1; i < 4; i++) {
      champWinRate[i - 1] = await page.$eval(
        `div.box_content.champion_list.pt-2 > div:nth-child(${i}) > div:nth-child(2) > div.champion_card_stat.text-gold`,
        (el) => {
          return Number.parseFloat(el.innerHTML);
        }
      );
    }
    const gameCount: Array<number> = [0, 0, 0];
    for (let i = 1; i < 4; i++) {
      gameCount[i - 1] = await page.$eval(
        `div.box_content.champion_list.pt-2 > div:nth-child(${i}) > div:nth-child(2) > div.champion_card_mini_stat.text-vivid-gold`,
        (el) => {
          return Number.parseFloat(el.innerHTML.split(" ")[0]);
        }
      );
    }
    return <Array<MostPlayedChampions>>[
      {
        champIconUrl: champIcons?.[0] ?? "",
        winrate: champWinRate[0],
        gameCount: gameCount[0],
      },
      {
        champIconUrl: champIcons?.[1] ?? "",
        winrate: champWinRate[1],
        gameCount: gameCount[1],
      },
      {
        champIconUrl: champIcons?.[2] ?? "",
        winrate: champWinRate[2],
        gameCount: gameCount[2],
      },
    ];
  } catch (e) {
    console.log(e);
    throw Error("Cant extract MostPlayedChampions Data");
  }
}

export { extractPlayerInfo, extractBattleStats, extractMostPlayedChampions };
