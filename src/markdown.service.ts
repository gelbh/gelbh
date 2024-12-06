import MarkdownIt from "markdown-it";
import { config } from "./config";

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

  private generateBadges(): string {
    const websiteBadge = `<a href="${ config.social.website }"><img src="https://img.shields.io/badge/-Website-${ config.badges.colors.primary }?style=for-the-badge&logo=amp&logoColor=white" alt="Website Badge"/></a>`;
    const linkedinBadge = `<a href="${ config.social.linkedin }"><img src="https://img.shields.io/badge/-LinkedIn-${ config.badges.colors.primary }?style=for-the-badge&logo=Linkedin&logoColor=white" alt="LinkedIn Badge"/></a>`;
    const viewsBadge = `<img src="https://komarev.com/ghpvc/?username=${ config.github.username }&style=for-the-badge" alt="Profile Views Count Badge"/>`;

    return `${ websiteBadge } ${ linkedinBadge } ${ viewsBadge }`;
  }

  private generateGitHubStats(): string {
    const baseParams = {
      username: config.github.username,
      hide_border: "true",
      custom_title: "GitHub Open Source Stats",
      hide: "contribs,issues,prs,stars",
      show_icons: "true",
      include_all_commits: "true",
      count_private: "true",
      card_width: "600",
      icon_color: config.badges.colors.primary,
    };

    const getDarkModeParams = () => ({
      ...baseParams,
      title_color: config.badges.colors.primary,
      text_color: config.badges.colors.textDark,
      theme: "transparent",
    });

    const getLightModeParams = () => ({
      ...baseParams,
      title_color: config.badges.colors.primary,
      text_color: config.badges.colors.textLight,
      theme: "transparent",
    });

    return `<p align="center">
<a href="https://github.com/${ config.github.username }/${ config.github.username
      }#gh-dark-mode-only">
  <img src="https://github-readme-stats.vercel.app/api?${ new URLSearchParams(
        getDarkModeParams()
      ).toString() }#gh-dark-mode-only" alt="GitHub Stats Dark Mode"/>
</a>
<a href="https://github.com/${ config.github.username }/${ config.github.username
      }#gh-light-mode-only">
  <img src="https://github-readme-stats.vercel.app/api?${ new URLSearchParams(
        getLightModeParams()
      ).toString() }#gh-light-mode-only" alt="GitHub Stats Light Mode"/>
</a>
</p>`;
  }

  //   private generateTechStack(): string {
  //     return Object.entries(config.skills)
  //       .map(
  //         ([category, items]) => `
  // ### ${category.charAt(0).toUpperCase() + category.slice(1)}

  // <p align="center">
  //   ${items
  //     .map(
  //       (item) =>
  //         `<img src="https://img.shields.io/badge/-${item}-${
  //           config.badges.colors.primary
  //         }?style=flat&logo=${item.toLowerCase()}&logoColor=white" alt="${item}"/>`
  //     )
  //     .join(" ")}
  // </p>`
  //       )
  //       .join("\n\n");
  //   }

  private generateCodingStats(): string {
    return `<p align="center">
    <picture>
      <img src="https://github-readme-streak-stats.herokuapp.com/?user=${ config.github.username
      }&theme=transparent&hide_border=true&card_width=600" alt="GitHub streak"/>
    </picture>
  </p>
  ${ config.github.wakatime_username
        ? `
  <p align="center">
    <picture>
      <img src="https://github-readme-stats.vercel.app/api/wakatime?username=${ config.github.wakatime_username }&layout=compact&theme=transparent&hide_border=true&card_width=600" alt="WakaTime stats"/>
    </picture>
  </p>`
        : ""
      }`;
  }

  async generateReadme(reposList: string): Promise<string> {
    const content = `<div align="center">

${ this.generateBadges() }

---

Hi there 👋!

---

${ this.generateGitHubStats() }

---

${ this.generateCodingStats() }

</div>

---

## Open Source Projects
${ reposList }

---

<div align="center">
<a href="${ config.social.website }" target="_blank" rel="noopener noreferrer">
  <img src="${ config.social.website
      }/favicon.ico" width="30" alt="Website Icon"/>
</a>
</div>`;

    return content;
  }
}