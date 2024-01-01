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

      let starsAndForksDisplay = "";
      if (stars > 0) {
        starsAndForksDisplay += `<b>${stars}</b> ✨`;
      }
      if (forks > 0) {
        starsAndForksDisplay += starsAndForksDisplay
          ? ` and <b>${forks}</b> 🍴`
          : `<b>${forks}</b> 🍴`;
      }
      starsAndForksDisplay = starsAndForksDisplay
        ? ` (${starsAndForksDisplay})`
        : "";

      return `<li><a href=${url} target="_blank" rel="noopener noreferrer">${name}</a>${starsAndForksDisplay}: ${desc}</li>`;
    })
  );

  return `<ul>${list.join("")}\n<li>More coming soon :).</li>\n</ul>`;
}
