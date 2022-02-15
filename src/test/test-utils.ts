import chromium from "chrome-aws-lambda";
import { Page } from "puppeteer-core";

export default async (
  callback: (page: Page) => Promise<void>
): Promise<void> => {
  let browser;
  let page;
  try {
    browser = browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
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
