import { ALL_SITES } from "./globalVars";

export function searchUrl(keyword: string, siteName: string): string {
  switch (siteName) {
    case ALL_SITES["freelancer"][0]: {
      return `https://www.karlancer.com/search?q=${keyword}`;
    }
    case ALL_SITES["freelancer"][1]: {
      return `https://parscoders.com/project/title/${keyword}/exact-title/1/only-available/1/`;
    }
    case ALL_SITES["freelancer"][2]: {
      return `https://parsfl.ir/search-projects?searchContent=${keyword}`;
    }
    case ALL_SITES["freelancer"][3]: {
      return `https://ponisha.ir/search/projects?page=1&query=${keyword}&order=approved_at%7Cdesc&category=-&promotion=-&filterByProjectStatus=open`;
    }
    case ALL_SITES["job"][0]: {
      return `https://divar.ir/s/iran/jobs?q=${keyword}`;
    }
    case ALL_SITES["job"][1]: {
      return `https://www.e-estekhdam.com/search/%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D8%A8%D8%B1%D8%A7%DB%8C-${keyword}`;
    }
    case ALL_SITES["job"][2]: {
      return `https://www.irantalent.com/jobs/search?keyword=${keyword}&language=persian`;
    }
    case ALL_SITES["job"][3]: {
      return `https://jobinja.ir/jobs?filters%5Bkeywords%5D%5B%5D=${keyword}&filters%5Blocations%5D%5B%5D=&filters%5Bjob_categories%5D%5B%5D=&b=`;
    }
    case ALL_SITES["job"][4]: {
      return `https://jobvision.ir/jobs/keyword/${keyword}?page=1&sort=1`;
    }
    case ALL_SITES["job"][5]: {
      return `https://www.sheypoor.com/s/iran/jobs?c=43618&q=${keyword}&a77000=451701`;
    }
  }

  return "-1";
}
