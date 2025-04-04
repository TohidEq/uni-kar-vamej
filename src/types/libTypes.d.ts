export {};

declare global {
  interface SearchProps {
    keyword: string;
    searchableSites: string[];
  }

  interface SearchResult {
    jobs: ?Jobitem[];
    freelancers: ?FreelancerItem[];
  }
}
