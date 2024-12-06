import { writeFile } from "fs/promises";
import { GitHubService } from "./github.service";
import { MarkdownService } from "./markdown.service";

async function main() {
  try {
    const markdownService = new MarkdownService();
    const reposList = await GitHubService.generateReposList();
    const readme = await markdownService.generateReadme(reposList);

    const readmeContent = `<!-- Profile README -->\n${ readme }\n<!-- End README -->`;

    await writeFile("README.md", readmeContent);
    console.log("✅ README.md generated successfully");
  } catch (error) {
    console.error("Failed to generate README:", error);
    process.exit(1);
  }
}

main();