import TestData from '@/lib/static/testprojects.json';

export type GitHubType = {
  name: string;
  html_url: string;
  description: null | string;
  homepage: null | string;
};

export async function GitHubAPI() {
  if (process.env.NODE_ENV === 'production') {
    try {
      const res = await fetch(
        'https://api.github.com/users/redskull-127/repos?sort=created',
      );
      const data = await res.json();
      const repos: GitHubType[] = data.map((repo: GitHubType) => ({
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description,
        homepage: repo.homepage,
      }));
      return repos;
    } catch (err) {
      console.log(err);
      return new Error('Something went wrong');
    }
  } else {
    try {
      return TestData;
    } catch (err) {
      console.log(err);
      return new Error('Something went wrong');
    }
  }
}
