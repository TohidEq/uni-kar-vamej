import getKarlancerAll from "./freelancer/karlancer/getKarlancerAll";
import getPunishaAll from "./freelancer/punisha/getPunishaAll";
import { ALL_SITES, getBrowser } from "./globalVars";
import getJobinjaAll from "./job/jobinja/getJobinjaAll";
import getJobvisionAll from "./job/jobVision/getJobVisionAll";

export default async function getSearchResult(
  Props: SearchProps
): Promise<{ jobs: JobItem[]; freelancers: FreelancerItem[] }> {
  const results: { jobs: JobItem[]; freelancers: FreelancerItem[] } = {
    jobs: [],
    freelancers: [],
  };

  console.log(
    process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production"
      ? "Production log:"
      : "Development log:"
  );
  console.log("keyword:", Props.keyword);
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  for (const site of Props.searchableSites) {
    console.log("start ->", site);
    let resultCounter: number = 0;
    switch (site) {
      // ==== FREELANCERS ====
      case ALL_SITES["freelancer"][0]: {
        const karlancerResults = await getKarlancerAll(Props.keyword, page);
        resultCounter = karlancerResults?.length || 0;
        if (karlancerResults?.length) {
          results.freelancers.push(...karlancerResults);
        }

        break;
      }
      case ALL_SITES["freelancer"][1]: {
        const ponishaResults = await getPunishaAll(Props.keyword, page);
        resultCounter = ponishaResults?.length || 0;
        if (ponishaResults?.length) {
          results.freelancers.push(...ponishaResults);
        }
        break;
      }
      // ======= JOBS ========
      case ALL_SITES["job"][0]: {
        const jobinjaResults = await getJobinjaAll(Props.keyword, page);
        resultCounter = jobinjaResults?.length || 0;
        if (jobinjaResults?.length) {
          results.jobs.push(...jobinjaResults);
        }
        break;
      }
      case ALL_SITES["job"][1]: {
        const jobVisionResults = await getJobvisionAll(Props.keyword, page);
        resultCounter = jobVisionResults?.length || 0;
        if (jobVisionResults?.length) {
          results.jobs.push(...jobVisionResults);
        }
        break;
      }
      default:
        console.warn(`No handler for site: ${site}`);
    }
    console.log("end <- ", site);
    console.log(`site: ${site} \t Done \t ${resultCounter} results founded`);
  }
  page.close();
  browser.close();
  return results;
}
