import { Page } from "puppeteer";
import puppeteer from "puppeteer";
export default async (
  callback: (page: Page) => Promise<void>
): Promise<void> => {
  let browser;
  let page;
  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await callback(page);
    return;
  } catch (e) {
    console.log(e);
    return;
  } finally {
    await page?.close();
    await browser?.close();
  }
};
