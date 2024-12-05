import { config } from "./config";
import { GitHubRepo } from "./types";

export class GitHubService {
  private static readonly API_BASE = "https://api.github.com/repos";

  static async fetchRepositoryData(repo: string): Promise<GitHubRepo> {
    const response = await fetch(
      `${this.API_BASE}/${config.github.username}/${repo}`
    );

    if (!response.ok) {
      throw new Error(
        `Repository "${config.github.username}/${repo}" not found`
      );
    }

    return response.json();
  }

  static formatRepoStats(stars: number, forks: number): string {
    const stats = [];
    if (stars > 0) stats.push(`<b>${stars}</b> ✨`);
    if (forks > 0) stats.push(`<b>${forks}</b> 🍴`);
    return stats.length ? ` (${stats.join(" and ")})` : "";
  }

  static async generateReposList(): Promise<string> {
    const repos = await Promise.all(
      config.github.repos.map(async (repo) => {
        const data = await this.fetchRepositoryData(repo);
        const stats = this.formatRepoStats(
          data.stargazers_count,
          data.forks_count
        );
        const description = data.description ? `: ${data.description}` : "";

        return `<li><a href=${data.html_url} target="_blank" rel="noopener noreferrer">
          ${data.full_name}</a>${stats}${description}</li>`;
      })
    );

    return `<ul>${repos.join("\n")}</ul>`;
  }
}
