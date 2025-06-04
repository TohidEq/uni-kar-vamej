export {};

declare global {
  interface SearchProps {
    keyword: string;
    searchableSites: string[];
  }

  interface SearchResult {
    jobs: JobItem[] | null;
    freelancers: FreelancerItem[] | null;
  }

  type SiteName = "karlancer" | "ponisha" | "jobinja" | "jobvision";
}
