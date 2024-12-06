import MarkdownIt from "markdown-it";
import { config } from "./config";
import { GitHubRepo } from "./types";

export class MarkdownService {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      xhtmlOut: false,
    });
  }

  private generateGitHubStats(): string {
    const baseParams = {
      username: config.github.username,
      hide_border: "true",
      include_all_commits: "true",
      count_private: "true",
      show_icons: "true",
    };

    const activityStats = new URLSearchParams({
      ...baseParams,
      theme: "transparent",
      custom_title: "GitHub Activity",
    }).toString();

    const languageParams = new URLSearchParams({
      ...baseParams,
      theme: "transparent",
      layout: "compact",
      langs_count: "6",
      card_width: "495",
    }).toString();

    return `<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?${ activityStats })

![Most Used Languages](https://github-readme-stats.vercel.app/api/top-langs/?${ languageParams })

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${ config.github.username }&theme=transparent&hide_border=true&card_width=600)

</div>`;
  }

  async generateReadme(reposList: string): Promise<string> {
    return this.generateGitHubStats();
  }
}