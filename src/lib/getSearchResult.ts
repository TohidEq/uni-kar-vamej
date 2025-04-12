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

  console.log("keyword:", Props.keyword);
  for (const site of Props.searchableSites) {
    console.log("site:", site);

    switch (site) {
      // ==== FREELANCERS ====
      case ALL_SITES["freelancer"][0]: {
        const karlancerResults = await getKarlancerAll(Props.keyword);
        if (karlancerResults?.length) {
          results.freelancers.push(...karlancerResults);
        }

        break;
      }
      case ALL_SITES["freelancer"][1]: {
        const ponishaResults = await getPunishaAll(Props.keyword);
        if (ponishaResults?.length) {
          results.freelancers.push(...ponishaResults);
        }
        break;
      }
      // ======= JOBS ========
      case ALL_SITES["job"][0]: {
        const jobinjaResults = await getJobinjaAll(Props.keyword);
        if (jobinjaResults?.length) {
          results.jobs.push(...jobinjaResults);
        }
        break;
      }
      case ALL_SITES["job"][1]: {
        const jobVisionResults = await getJobvisionAll(Props.keyword);
        if (jobVisionResults?.length) {
          results.jobs.push(...jobVisionResults);
        }
        break;
        break;
      }
      default:
        console.warn(`No handler for site: ${site}`);
    }
  }

  return results;
}
