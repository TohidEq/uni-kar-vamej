// import { Page } from "puppeteer";
export default async function getJobinjaOne(
  url: string
  // page: Page
): Promise<JobItem> {
  // Needs a Punisha Account
  return {
    type: "",
    url: url,
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
    id: url,
  };
}
