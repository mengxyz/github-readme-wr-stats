import { extractPlayerInfo, extractBattleStats } from "../extract-data";
import fs from "fs";

test("extract player info", () => {
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

  expect(extractPlayerInfo(html)).toStrictEqual(expectData);
});

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
  expect(await extractBattleStats(html)).toStrictEqual(expectData);
}, 10000);

// test("extract Most Played Champions", () => {
//   throw Error();
// });

// test("extract Recent Matchs", () => {
//   throw Error();
// });
