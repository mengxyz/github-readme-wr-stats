import {
  extractPlayerInfo,
  extractBattleStats,
  extractMostPlayedChampions,
} from "../extract-data";
import fs from "fs";
import testUtils from "./test-utils";

test("extract player info", async () => {
  const html = fs.readFileSync(
    __dirname + "/data/mock_avilable_data.html",
    "utf-8"
  );
  const expectData: PlayerInfo = {
    name: "จารแดง",
    tag: "0000",
    rank: <Rank>{
      logoUrl: "https://cdn.wildstats.gg/images/ranks/emerald.png",
      title: "Emerald IV",
    },
    level: "40",
  };
  await testUtils(async (page) => {
    await page.setContent(html);
    expect(await extractPlayerInfo(page)).toStrictEqual(expectData);
  });
}, 10000);

test("extract Battle stats", async () => {
  const html = fs.readFileSync(
    __dirname + "/data/mock_avilable_data.html",
    "utf-8"
  );
  const expectData: BattleStats = {
    winratte: "49.12%",
    mvp: "98",
    played: "3,744",
    kdaAvg: 3.9,
    tp: 18.8,
    gpm: 581,
    add: 13_154,
    adt: 17_197,
    atd: 1_387,
  };
  testUtils(async (page) => {
    await page.setContent(html);
    expect(await extractBattleStats(page)).toStrictEqual(expectData);
  });
}, 10000);

test("extract Most Played Champions", async () => {
  const html = fs.readFileSync(
    __dirname + "/data/mock_avilable_data.html",
    "utf-8"
  );
  const expectData: Array<MostPlayedChampions> = [
    {
      champIconUrl: "https://cdn.wildstats.gg/images/champions/icons/10021.jpg",
      winrate: 50,
      gameCount: 334,
    },
    {
      champIconUrl: "https://cdn.wildstats.gg/images/champions/icons/10081.jpg",
      winrate: 47.14,
      gameCount: 210,
    },
    {
      champIconUrl: "https://cdn.wildstats.gg/images/champions/icons/10048.jpg",
      winrate: 56.29,
      gameCount: 151,
    },
  ];

  await testUtils(async (page) => {
    await page.setContent(html);
    expect(await extractMostPlayedChampions(page)).toStrictEqual(expectData);
  });
}, 10000);

// test("extract Recent Matchs", () => {
//   throw Error();
// });
