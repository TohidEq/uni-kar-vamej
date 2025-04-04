export {};

declare global {
  export interface FreelancerItem {
    url: string;
    title: string;
    caption: ?string;
    salary: number;
    image: ?string; // img url
    time: ?string;
    owner: string;
  }

  export interface JobItem {
    url: string;
    title: string;
    caption: ?string;
    salary: number;
    salaryStart: number;
    salaryEnd: number;
    image: ?string; // img url
    time: ?string;
    owner: string;
    location: string;
    jobType: ?string;
  }

  export interface SavedJobItem {
    id: string; // url
    Item: JobItem;
    created_at: Date;
  }
  export interface SavedFreelancerItem {
    id: string; // url
    Item: FreelancerItem;
    created_at: Date;
  }

  export interface SavedItems {
    jobItems: ?SavedJobItem[];
    freelancerItems: ?SavedFreelancerItem[];
  }
}
