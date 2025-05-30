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

    id: string;
    // url: string;
    // title: string;
    // salary: string | number;
    // // description?: string;
    // type?: string;
    // image?: string;
  }

  interface JobItem {
    type: string;
    url: string;
    title: string;
    caption: ?string;
    salary: number;
    salaryStart: ?number;
    salaryEnd: ?number;
    image: ?string; // img url
    time: ?string;
    owner: string;
    location: ?string;
    jobType: ?string;

    id: string;
    // url: string;
    // title: string;
    // salaryStart: string | number;
    // salaryEnd: string | number;
    // // description?: string;
    // location: string;
    // jobType: string;
    // type: string;
    // image?: string;
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
