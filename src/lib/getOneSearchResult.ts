import getKarlancerOne from "./freelancer/karlancer/getKarlancerOne";
import getPunishaOne from "./freelancer/ponisha/getPunishaOne";
import getJobinjaOne from "./job/jobinja/getJobinjaOne";
import getJobVisionOne from "./job/jobVision/getJobVisionOne";
import { ALL_SITES, getBrowser } from "./globalVars";

interface SearchOneProps {
  url: string;
  siteType: string;
}

export default async function getOneSearchResult(
  props: SearchOneProps
): Promise<JobItem | null> {
  const { url, siteType } = props;
  let result: JobItem | null = null;

  console.log("url:", url, "siteType:", siteType);

  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  try {
    console.log("start ->", siteType);
    switch (siteType) {
      // ==== FREELANCERS ====
      case ALL_SITES.freelancer[0]: {
        result = await getKarlancerOne(url, page);
        break;
      }
      case ALL_SITES.freelancer[1]: {
        result = await getPunishaOne(url, page);
        break;
      }
      // ======= JOBS ========
      case ALL_SITES.job[0]: {
        result = await getJobinjaOne(url /*, page */);
        break;
      }
      case ALL_SITES.job[1]: {
        result = await getJobVisionOne(url, page);
        break;
      }
      default:
        console.warn(`No handler for siteType: ${siteType}`);
    }
    console.log("end <- ", siteType);
    console.log(
      `siteType: ${siteType} \t Done \t ${
        result ? "1 result found" : "No result found"
      }`
    );
  } catch (error) {
    console.error(`Error scraping ${siteType} for URL ${url}:`, error);
  } finally {
    // page.close();
    browser.close();
  }

  return result;
}
