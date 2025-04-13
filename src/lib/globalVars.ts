
import Chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

export const ALL_SITES = {
  freelancer: ["karlancer", "punisha"],
  job: ["jobinja", "jobvision"],
};

export const getBrowser = async () =>
  await puppeteerCore.launch({
    args: Chromium.args,
    executablePath: await Chromium.executablePath(),
    headless: Chromium.headless,
  });
