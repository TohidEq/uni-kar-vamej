import getKarlancerAll from "./freelancer/karlancer/getKarlancerAll";
import getPunishaAll from "./freelancer/punisha/getPunishaAll";
import { ALL_SITES } from "./globalVars";
import getJobinjaAll from "./job/jobinja/getJobinjaAll";
import getJobvisionAll from "./job/jobVision/getJobVisionAll";

export default async function getSearchResult(Props: SearchProps) {
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
  for (const site of Props.searchableSites) {
    console.log("site:", site);
    let resultCounter: number = 0;
    switch (site) {
      // ==== FREELANCERS ====
      case ALL_SITES["freelancer"][0]: {
        const karlancerResults = await getKarlancerAll(Props.keyword);
        resultCounter = karlancerResults?.length || 0;
        if (karlancerResults?.length) {
          results.freelancers.push(...karlancerResults);
        }

        break;
      }
      case ALL_SITES["freelancer"][1]: {
        const ponishaResults = await getPunishaAll(Props.keyword);
        resultCounter = ponishaResults?.length || 0;
        if (ponishaResults?.length) {
          results.freelancers.push(...ponishaResults);
        }
        break;
      }
      // ======= JOBS ========
      case ALL_SITES["job"][0]: {
        const jobinjaResults = await getJobinjaAll(Props.keyword);
        resultCounter = jobinjaResults?.length || 0;
        if (jobinjaResults?.length) {
          results.jobs.push(...jobinjaResults);
        }
        break;
      }
      case ALL_SITES["job"][1]: {
        const jobVisionResults = await getJobvisionAll(Props.keyword);
        resultCounter = jobVisionResults?.length || 0;
        if (jobVisionResults?.length) {
          results.jobs.push(...jobVisionResults);
        }
        break;
        break;
      }
      default:
        console.warn(`No handler for site: ${site}`);
    }
    console.log(`site: ${site} \t Done \t ${resultCounter} results founded`);
  }

  return results;
}
