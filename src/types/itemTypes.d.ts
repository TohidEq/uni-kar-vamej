export {};

declare global {
  interface FreelancerItem {
    type: string;
    url: string;
    title: string;
    caption: ?string;
    salary: number;
    image: ?string; // img url
    time: ?string;
    owner: string;
  }

  interface JobItem {
    url: string;
    title: string;
    caption: ?string;
    salary: number;
    salaryStart: ?number;
    salaryEnd: ?number;
    image: ?string; // img url
    time: ?string;
    owner: string;
    location: string;
    jobType: ?string;
  }

  interface SavedJobItem {
    id: string; // url
    Item: JobItem;
    created_at: Date;
  }

  interface SavedFreelancerItem {
    id: string; // url
    Item: FreelancerItem;
    created_at: Date;
  }

  interface SavedItems {
    jobItems: ?SavedJobItem[];
    freelancerItems: ?SavedFreelancerItem[];
  }
}
