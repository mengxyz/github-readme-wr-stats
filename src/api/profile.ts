import { VercelRequest, VercelResponse } from "@vercel/node";
import puppeteer from "puppeteer";
import fs from "fs";
import { extractPlayerInfo } from "../extract-data";
import { BASE_API_ENDPOINT } from "../constant";

export default async (req: VercelRequest, res: VercelResponse) => {
  let browser;
  let page;
  try {
    res.setHeader("Content-Type", "image/png");
    res.statusCode = 200;
    const profile = req.query.profile as string | undefined;
    if (!profile) {
      throw Error("ccant get profile");
    }
    const html = fs.readFileSync(
      __dirname + "/../../template/profile.html",
      "utf8"
    );
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`${BASE_API_ENDPOINT}${profile}`);
    const playerInfo = await extractPlayerInfo(page);
    let template = html.replace("{ID}", playerInfo.name + "#" + playerInfo.tag);
    template = template.replace("{RANK}", playerInfo.rank.title);
    template = template.replace("{RANK_ICON}", playerInfo.rank.logoUrl);
    await page.setContent(template);
    const content = await page.$("#profile-content");
    const imgBuffer = await content?.screenshot({ omitBackground: true });
    const base64 = imgBuffer?.toString("base64");
    res.send(imgBuffer!);
  } catch (e) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.send("Somthing went wrong");
  } finally {
    page?.close();
    browser?.close();
  }
};
