import getKarlancerOne from "./freelancer/karlancer/getKarlancerOne";
import getPunishaOne from "./freelancer/punisha/getPunishaOne";
import { ALL_SITES } from "./globalVars";
import getJobinjaOne from "./job/jobinja/getJobinjaOne";
import getJobVisionOne from "./job/jobVision/getJobVisionOne";

export default async function getOneSearchResult(Props: {
  url: string;
  site: string;
}): Promise<JobItem> {
  const { site, url } = Props;
  const result: { resultOne: JobItem } = {
    resultOne: {
      type: "",
      url: "",
      title: "",
      caption: null,
      salary: 0,
      salaryStart: null,
      salaryEnd: null,
      image: null,
      time: null,
      owner: "",
      location: null,
      jobType: null,
    },
  };

  console.log(
    process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production"
      ? "Production log:"
      : "Development log:"
  );

  switch (site) {
    // ==== FREELANCERS ====
    case ALL_SITES["freelancer"][0]: {
      const karlancerResult = await getKarlancerOne(Props.url);
      result.resultOne = { ...karlancerResult };
      break;
    }
    case ALL_SITES["freelancer"][1]: {
      const ponishaResult = await getPunishaOne(Props.url);
      result.resultOne = { ...ponishaResult };
      break;
    }
    // ======= JOBS ========
    case ALL_SITES["job"][0]: {
      const jobinjaResult = await getJobinjaOne(Props.url);
      result.resultOne = { ...jobinjaResult };
      break;
    }
    case ALL_SITES["job"][1]: {
      const jobVisionResult = await getJobVisionOne(Props.url);
      result.resultOne = { ...jobVisionResult };
      break;
    }
    default:
      console.warn(`No handler for site: ${site} and url: ${url}`);
  }

  return result.resultOne;
}
