export default async function getJobVisionOne(url: string): Promise<JobItem> {
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
  };
}
