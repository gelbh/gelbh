"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const md = require("markdown-it")({
    html: true, // Enable HTML tags in source
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links
});
const fetchRssData_1 = require("./fetchRssData");
const fetchGitHubData_1 = require("./fetchGitHubData");
const blogFeedUrl = "https://blog.bolajiayodeji.com/rss.xml";
const newsletterFeedUrl = "https://bawd.bolajiayodeji.com/feed";
const ossProjectRepos = ["gelbh"];
const ossLearningMaterialRepos = [""];
const githubUsername = "gelbh";
const websiteUrl = "https://gelbhart.com";
const blogUrl = "";
const newsletterUrl = "";
const youtubeUrl = "";
const slidesUrl = "";
const twitterUrl = "";
const linkedinUrl = "https://linkedin.com/in/tomer-gelbhart";
const githubSponsorsUrl = "";
const patreonUrl = "";
function generateMarkdown() {
    return __awaiter(this, void 0, void 0, function* () {
        const websiteBadge = `[![Website Badge](https://img.shields.io/badge/-Website-3B7EBF?style=for-the-badge&logo=amp&logoColor=white)](${websiteUrl})`;
        const hashnodeBadge = `[![Blog Badge](https://img.shields.io/badge/-Blog-3B7EBF?style=for-the-badge&logo=Hashnode&logoColor=white)](${blogUrl})`;
        const substackBadge = `[![Newsletter Badge](https://img.shields.io/badge/-Newsletter-3B7EBF?style=for-the-badge&logo=Substack&logoColor=white)](${newsletterUrl})`;
        const youtubeBadge = `[![YouTube Badge](https://img.shields.io/badge/-Youtube-3B7EBF?style=for-the-badge&logo=Youtube&logoColor=white)](${youtubeUrl})`;
        const slidesBadge = `[![Slides Badge](https://img.shields.io/badge/-Slides-3B7EBF?style=for-the-badge&logo=slides&logoColor=white)](${slidesUrl})`;
        const linkedinBadge = `[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-3B7EBF?style=for-the-badge&logo=Linkedin&logoColor=white)](${linkedinUrl})`;
        const twitterBadge = `[![Twitter Badge](https://img.shields.io/badge/-@iambolajiayo-3B7EBF?style=for-the-badge&logo=x&logoColor=white)](${twitterUrl})`;
        const githubSponsorsBadge = `[![GitHub Sponsors Badge](https://img.shields.io/badge/-github%20sponsors-3B7EBF?style=for-the-badge&logo=github&logoColor=white)](${githubSponsorsUrl})`;
        const patreonBadge = `[![Patreon Badge](https://img.shields.io/badge/-Patreon-3B7EBF?style=for-the-badge&logo=Patreon&logoColor=white)](${patreonUrl})`;
        const profileCountBadge = `![Profile Views Count Badge](https://komarev.com/ghpvc/?username=${githubUsername}&style=for-the-badge)`;
        const githubStatsCardDark = `[![GitHub-Stats-Card-Dark](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&hide_border=true&include_all_commits=true&card_width=600&custom_title=GitHub%20Open%20Source%20Stats&title_color=3B7EBF&text_color=FFF&icon_color=3B7EBF&hide=contribs&show=reviews,prs_merged,prs_merged_percentage&theme=transparent#gh-dark-mode-only)](https://github.com/${githubUsername}/${githubUsername}#gh-dark-mode-only)`;
        const githubStatsCardLight = `[![GitHub-Stats-Card-Light](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&hide_border=true&include_all_commits=true&card_width=600&custom_title=GitHub%20Open%20Source%20Stats&title_color=3B7EBF&text_color=474A4E&icon_color=3B7EBF&hide=contribs&show=reviews,prs_merged,prs_merged_percentage&theme=transparent#gh-light-mode-only)](https://github.com/${githubUsername}/${githubUsername}#gh-light-mode-only)`;
        const markdownText = `<div align="center">\n

  ${websiteBadge} ${hashnodeBadge} ${substackBadge} ${youtubeBadge} ${slidesBadge} ${linkedinBadge} ${twitterBadge} ${githubSponsorsBadge} ${patreonBadge} ${profileCountBadge}\n

  ---\n

  Hi there 👋🏾! I'm an innovative technology professional with progressive IT, web engineering, data, embedded systems, developer relations, documentation, technical writing, open-source, community building, and entrepreneurship experience in for-profit startups and non-profit technology and education organizations. I create technical content, build open-source projects and learning materials, speak/teach at developer meetups/conferences, and build several technical communities.\n

  ---\n

  ${githubStatsCardDark}\n
  ${githubStatsCardLight}\n

  </div>\n

  ---\n

  ## Highlights

  <details>\n
  <summary>OSS Projects</summary>\n
  <br />
  Here are some of my other projects you might want to check out that are not pinned:\n
  <br />\n<br />
  ${yield (0, fetchGitHubData_1.fetchGitHubData)(ossProjectRepos)}\n
  </details>\n

  <details>\n
  <summary>OSS Learning Materials</summary>\n
  <br />
  Here are some of my unique-styled workshop materials you can use to learn key concepts at your own pace:\n
  <br />\n<br />
  ${yield (0, fetchGitHubData_1.fetchGitHubData)(ossLearningMaterialRepos)}\n
  </details>\n

  <details>\n
  <summary>Recent Blogposts</summary>\n
  <br />
  ${yield (0, fetchRssData_1.fetchRssData)(blogFeedUrl)}\n
  </details>\n

  <details>\n
  <summary>Recent Newsletters</summary>\n
  <br />
  ${yield (0, fetchRssData_1.fetchRssData)(newsletterFeedUrl)}\n
  </details>\n

  <details>\n
  <summary>Quick Tips</summary>\n\n
  - 💬 How to reach me: DM [@iambolajiayo](https://twitter.com/iambolajiayo) on X (Twitter).\n
  - 📬 Where to find me: Subscribe to my [newsletter](https://bawd.bolajiayodeji.com/subscribe) to hear from me bi-weekly or send a game request on [chess.com](https://chess.com/member/bolajiayodeji).\n
  - 📖 Book recommendations: [Knowing God by J. I. Packer](https://bit.ly/3EdCFUW) and [Atomic Habits by James Clear](https://bit.ly/45r1kBH).\n
  - 💙 Fun fact: I'm in a blissful relationship [with Jesus Christ](https://biblegateway.com/passage/?search=1+Corinthians+15%3A1-11&version=NKJV). Check [this](https://bit.ly/3KYYHij) out :).\n
  </details>\n

  ---\n

  <a href="#">Learn how this works.</a> <a href="https://github.com/BolajiAyodeji/BolajiAyodeji/actions/workflows/build.yml"><img src="https://github.com/BolajiAyodeji/BolajiAyodeji/actions/workflows/build.yml/badge.svg" align="right" alt="Rebuild README.md file"></a>\n

  <div align="center">\n
   <a href="https://bolajiayodeji.com" target="_blank" rel="noopener noreferrer"><img src="https://bolajiayodeji.com/favicon.png" width="30" /></a>\n
  </div>`;
        const result = md.render(markdownText);
        fs.writeFile("README.md", result, (error) => {
            if (error)
                throw new Error(`Something went wrong: ${error}.`);
            console.log(`✅ README.md file was succesfully generated.`);
        });
    });
}
generateMarkdown();
