export async function fetchGitHubData(repos: Array<string>): Promise<string> {
  const owner = "gelbh";

  const list = await Promise.all(
    repos.map(async (repo) => {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
      );
      if (!response.ok) {
        throw new Error(
          `"${owner}/${repo}" not found. Kindly review your list of repositories.`
        );
      }
      const data = await response.json();

      const {
        html_url: url,
        full_name: name,
        stargazers_count: stars,
        forks_count: forks,
        description: desc,
      } = data;

      let starsDisplay = stars > 0 ? `<b>${stars}</b> ✨` : "";
      let forksDisplay = forks > 0 ? `<b>${forks}</b> 🍴` : "";

      let repoDetails =
        starsDisplay || forksDisplay
          ? ` (${starsDisplay}${
              forksDisplay ? (starsDisplay ? " and " : "") + forksDisplay : ""
            })`
          : "";

      const descriptionDisplay = desc ? `: ${desc}` : "";

      return `<li><a href=${url} target="_blank" rel="noopener noreferrer">${name}</a>${repoDetails}${descriptionDisplay}</li>`;
    })
  );

  return `<ul>${list.join("")}\n</ul>`;
}
