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
    const websiteBadge = /*html*/`<a href="${ config.social.website }">
      <img 
        src="https://img.shields.io/badge/-Website-${ config.badges.colors.primary }?style=for-the-badge&logo=amp&logoColor=white" 
        alt="Website Badge"
      />
    </a>`;

    const linkedinBadge = /*html*/`<a href="${ config.social.linkedin }">
      <img 
        src="https://img.shields.io/badge/-LinkedIn-${ config.badges.colors.primary }?style=for-the-badge&logo=Linkedin&logoColor=white" 
        alt="LinkedIn Badge"
      />
    </a>`;

    const viewsBadge = /*html*/`
      <img 
        src="https://komarev.com/ghpvc/?username=${ config.github.username }&style=for-the-badge" 
        alt="Profile Views Count Badge"
      />`;

    return /*html*/`${ websiteBadge } ${ linkedinBadge } ${ viewsBadge }`;
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

    return /*html*/`
      <div>
        <a href="https://github.com/${ config.github.username }">
          <img 
            src="https://github-readme-stats.vercel.app/api?${ activityStats }" 
            height="180" 
          />
        </a>
        <br />
        <br />
        <br />
        <a href="https://github.com/${ config.github.username }">
          <img 
            src="https://github-readme-stats.vercel.app/api/top-langs/?${ languageParams }"
          />
        </a>
      </div>
    `;
  }

  private generateCodingStreak(): string {
    return /*html*/`
      <img 
        src="https://github-readme-streak-stats.herokuapp.com/?user=${ config.github.username }&theme=transparent&hide_border=true&card_width=600" 
        alt="GitHub streak" 
      />
    `;
  }

  private generateSkillBadges(skills: string[], label: string): string {
    const badges = skills
      .map(
        (skill) => /*html*/`
          <img 
            src="https://img.shields.io/badge/-${ skill }-${ config.badges.colors.primary }?style=flat&logo=${ skill.toLowerCase() }&logoColor=white" 
            alt="${ skill }"
          />`
      )
      .join(" ");

    return /*html*/`
      <p align="center">
        ${ badges }
      </p>
    `;
  }

  private generateFooter(): string {
    return /*html*/`
      <div align="center">
        <a href="${ config.social.website }" target="_blank" rel="noopener noreferrer">
          <img 
            src="${ config.social.website }/favicon.ico" 
            width="30" 
            alt="Website Icon"
          />
        </a>
      </div>
    `;
  }

  async generateReadme(reposList: string): Promise<string> {
    const htmlContent = /*html*/`<div align="center">
    ${ this.generateGitHubStats() }
    <br/>
    <br/>
    ${ this.generateCodingStreak() }
  </div>`;

    return `${ htmlContent }`;
  }
}