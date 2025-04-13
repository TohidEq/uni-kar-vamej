import Chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

export const ALL_SITES = {
  freelancer: ["karlancer", "punisha"],
  job: ["jobinja", "jobvision"],
};
export const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

export const getBrowser = async () =>
  process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production"
    ? await puppeteerCore.launch({
        headless: true,
        args: Chromium.args,
        executablePath: await Chromium.executablePath(remoteExecutablePath),
      })
    : await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
