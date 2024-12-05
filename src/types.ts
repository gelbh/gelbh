export interface GitHubRepo {
  html_url: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  description: string | null;
}

export interface RssFeedItem {
  title: string;
  link: string;
  pubDate: string;
}
