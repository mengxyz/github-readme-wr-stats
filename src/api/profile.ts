import { VercelRequest, VercelResponse } from "@vercel/node";
import chromium from "chrome-aws-lambda";
import fs from "fs";
import { extractPlayerInfo } from "../extract-data";
import { BASE_API_ENDPOINT, REGION_KEY } from "../constant";

export default async (req: VercelRequest, res: VercelResponse) => {
  let browser;
  let page;
  try {
    res.setHeader("Content-Type", "image/png");
    const profile = req.query.profile as string | undefined;
    if (!profile) {
      throw Error("ccant get profile");
    }
    const html = fs.readFileSync(
      __dirname + "/../template/profile.html",
      "utf8"
    );
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.goto(
      `${BASE_API_ENDPOINT}${profile}`.replace(
        REGION_KEY,
        req.query.region as string
      )
    );
    const playerInfo = await extractPlayerInfo(page);
    let template = html.replace("{ID}", playerInfo.name + "#" + playerInfo.tag);
    template = template.replace("{RANK}", playerInfo.rank.title);
    template = template.replace("{RANK_ICON}", playerInfo.rank.logoUrl);
    template = template.replace(
      "{CARD_BG}",
      (req.query.bg_color ?? "white") as string
    );
    template = template.replace(
      "{FONT_COLOR}",
      (req.query.font_color ?? "black") as string
    );
    await page.setContent(template);
    const content = await page.$("#profile-content");
    const imgBuffer = await content?.screenshot({ omitBackground: true });
    res.send(imgBuffer!);
  } catch (e) {
    console.error(e);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.send("Somthing went wrong" + e);
  } finally {
    page?.close();
    browser?.close();
  }
};
