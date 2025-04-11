import { ALL_SITES } from "./globalVars";

export function searchUrl(keyword: string, siteName: string): string {
  switch (siteName) {
    case ALL_SITES["freelancer"][0]: {
      return `https://www.karlancer.com/search?q=${encodeURIComponent(
        keyword
      )}`;
    }

    case ALL_SITES["freelancer"][1]: {
      return `https://ponisha.ir/search/projects?page=1&query=${encodeURIComponent(
        keyword
      )}&order=approved_at%7Cdesc&category=-&promotion=-&filterByProjectStatus=open`;
    }

    case ALL_SITES["job"][0]: {
      return `https://jobinja.ir/jobs?filters%5Bkeywords%5D%5B%5D=${encodeURIComponent(
        keyword
      )}&filters%5Blocations%5D%5B%5D=&filters%5Bjob_categories%5D%5B%5D=&b=`;
    }
    case ALL_SITES["job"][1]: {
      return `https://jobvision.ir/jobs/keyword/${encodeURIComponent(
        keyword
      )}?page=1&sort=1`;
    }
  }

  return "-1";
}
