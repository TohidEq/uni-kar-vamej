import getKarlancerAll from "./freelancer/karlancer/getKarlancerAll";
import { ALL_SITES } from "./globalVars";

export default async function getSearchResult(Props: SearchProps) {
  const results: { jobs: JobItem[]; freelancers: FreelancerItem[] } = {
    jobs: [],
    freelancers: [],
  };

  for (const site of Props.searchableSites) {
    console.log("site:", site);
    console.log("keyword:", Props.keyword);

    switch (site) {
      // ==== FREELANCERS ====
      case ALL_SITES["freelancer"][0]: {
        const karlancerAll_results = await getKarlancerAll(Props.keyword);
        if (karlancerAll_results?.length) {
          results.freelancers.push(...karlancerAll_results);
        }
        break;
      }
      case ALL_SITES["freelancer"][1]: {
        // Add logic for the second freelancer site here
        break;
      }
      // ======= JOBS ========
      case ALL_SITES["job"][0]: {
        // Add logic for the first job site here
        break;
      }
      case ALL_SITES["job"][1]: {
        // Add logic for the second job site here
        break;
      }
      default:
        console.warn(`No handler for site: ${site}`);
    }
  }

  return results;
}
