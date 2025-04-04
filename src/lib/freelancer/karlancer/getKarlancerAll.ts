function getKarlancerAll(keyword: string): FreelancerItem[] {
  const x: FreelancerItem = {
    url: "",
    title: keyword,
    caption: null,
    salary: 0,
    image: null,
    time: null,
    owner: "",
  };
  const freelancerItems: FreelancerItem[] = [x, x];
  // finding results from website proccess here
  // and pushing them to `freelancerItems` var
  return freelancerItems;
}

export default getKarlancerAll;
