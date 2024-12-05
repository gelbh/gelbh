// markdown.service.ts
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
    const websiteBadge = `<a href="${config.social.website}"><img src="https://img.shields.io/badge/-Website-${config.badges.colors.primary}?style=for-the-badge&logo=amp&logoColor=white" alt="Website Badge"/></a>`;
    const linkedinBadge = `<a href="${config.social.linkedin}"><img src="https://img.shields.io/badge/-LinkedIn-${config.badges.colors.primary}?style=for-the-badge&logo=Linkedin&logoColor=white" alt="LinkedIn Badge"/></a>`;
    const viewsBadge = `<img src="https://komarev.com/ghpvc/?username=${config.github.username}&style=for-the-badge" alt="Profile Views Count Badge"/>`;

    return `${websiteBadge} ${linkedinBadge} ${viewsBadge}`;
  }

  private generateGitHubStats(): string {
    const darkMode = `<a href="https://github.com/${config.github.username}/${config.github.username}#gh-dark-mode-only">
      <img src="https://github-readme-stats.vercel.app/api?username=${config.github.username}&show_icons=true&hide_border=true&include_all_commits=true&card_width=600&custom_title=GitHub%20Open%20Source%20Stats&title_color=${config.badges.colors.primary}&text_color=${config.badges.colors.textDark}&icon_color=${config.badges.colors.primary}&hide=contribs&show=reviews,prs_merged,prs_merged_percentage&theme=transparent#gh-dark-mode-only" alt="GitHub Stats Dark Mode"/>
    </a>`;

    const lightMode = `<a href="https://github.com/${config.github.username}/${config.github.username}#gh-light-mode-only">
      <img src="https://github-readme-stats.vercel.app/api?username=${config.github.username}&show_icons=true&hide_border=true&include_all_commits=true&card_width=600&custom_title=GitHub%20Open%20Source%20Stats&title_color=${config.badges.colors.primary}&text_color=${config.badges.colors.textLight}&icon_color=${config.badges.colors.primary}&hide=contribs&show=reviews,prs_merged,prs_merged_percentage&theme=transparent#gh-light-mode-only" alt="GitHub Stats Light Mode"/>
    </a>`;

    return `${darkMode}\n${lightMode}`;
  }

  async generateReadme(reposList: string): Promise<string> {
    const template = `<div align="center">

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

<div align="center">
<a href="${config.social.website}" target="_blank" rel="noopener noreferrer">
  <img src="${
    config.social.website
  }/favicon.ico" width="30" alt="Website Icon"/>
</a>
</div>`;

    return this.md.render(template);
  }
}
