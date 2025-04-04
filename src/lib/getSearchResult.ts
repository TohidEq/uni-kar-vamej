import getKarlancerAll from "./freelancer/karlancer/getKarlancerAll";
import { ALL_SITES } from "./globalVars";

export default function getSearchResult(Props: SearchProps) {
  const test: { jobs: JobItem[]; freelancers: FreelancerItem[] } = {
    jobs: [],
    freelancers: [],
  };

  Props.searchableSites.forEach((site) => {
    console.log("site:", site);
    console.log("keyword:", Props.keyword);
    switch (site) {
      case ALL_SITES["freelancer"][0]: {
        getKarlancerAll(Props.keyword).forEach((freelancerItem) => {
          test.freelancers.push(freelancerItem);
        });
        break;
      }
      case ALL_SITES["freelancer"][1]: {
        break;
      }
      case ALL_SITES["freelancer"][2]: {
        break;
      }
      case ALL_SITES["freelancer"][3]: {
        break;
      }
      case ALL_SITES["job"][0]: {
        break;
      }
      case ALL_SITES["job"][1]: {
        break;
      }
      case ALL_SITES["job"][2]: {
        break;
      }
      case ALL_SITES["job"][3]: {
        break;
      }
      case ALL_SITES["job"][4]: {
        break;
      }
      case ALL_SITES["job"][5]: {
        break;
      }
    }
  });

  return test;
}
