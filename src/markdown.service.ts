import MarkdownIt from "markdown-it";
import { config } from "./config";

export class MarkdownService {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
    });
  }

  private generateBadges(): string {
    const badges = [
      this.createBadge("Website", config.social.website),
      this.createBadge("LinkedIn", config.social.linkedin, "Linkedin"),
      `![Profile Views](https://komarev.com/ghpvc/?username=${config.github.username}&style=for-the-badge)`,
    ];

    return badges.join(" ");
  }

  private createBadge(name: string, url: string, logo = "amp"): string {
    return `[![${name} Badge](https://img.shields.io/badge/-${name}-${config.badges.colors.primary}?style=for-the-badge&logo=${logo}&logoColor=white)](${url})`;
  }

  private generateGitHubStats(): string {
    const options = {
      username: config.github.username,
      show_icons: true,
      hide_border: true,
      include_all_commits: true,
      card_width: 600,
      hide: "contribs",
      show: "reviews,prs_merged,prs_merged_percentage",
    };

    return [
      this.createGitHubStatsCard(options, "dark"),
      this.createGitHubStatsCard(options, "light"),
    ].join("\n");
  }

  private createGitHubStatsCard(options: any, mode: "dark" | "light"): string {
    const params = new URLSearchParams({
      username: options.username,
      show_icons: "true",
      hide_border: "true",
      include_all_commits: "true",
      card_width: "600",
      custom_title: "GitHub Open Source Stats",
      title_color: config.badges.colors.primary,
      text_color:
        mode === "dark"
          ? config.badges.colors.textDark
          : config.badges.colors.textLight,
      icon_color: config.badges.colors.primary,
      hide: options.hide,
      show: options.show,
      theme: "transparent",
    });

    const url = `https://github-readme-stats.vercel.app/api?${params.toString()}#gh-${mode}-mode-only`;
    const imageAlt = `GitHub-Stats-Card-${
      mode.charAt(0).toUpperCase() + mode.slice(1)
    }`;
    return `[![${imageAlt}](${url})](https://github.com/${options.username}/${options.username}#gh-${mode}-mode-only)`;
  }

  async generateReadme(reposList: string): Promise<string> {
    const template = `
<div align="center">
  ${this.generateBadges()}
  ---
  Hi there 👋!
  ---
  ${this.generateGitHubStats()}
</div>

---

## Open Source Projects
${reposList}

---

<a href="https://gelbhart.dev" target="_blank" rel="noopener noreferrer">
  <img src="https://gelbhart.dev/favicon.ico" width="30" align="center" />
</a>`;

    return this.md.render(template);
  }
}
