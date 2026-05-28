const axios = require('axios');
const fs = require('fs').promises;

const CONFIG = {
  STATS_SVG_PATH: process.env.STATS_SVG_PATH || 'stats-card.svg',
  USERNAME: process.env.GITHUB_USERNAME || 'gelbh',
  GRAPHQL_URL: 'https://api.github.com/graphql',
  CONCURRENCY: 3,
};

const CONTRIBUTION_YEARS_QUERY = `
  query contributionYears($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionYears
      }
    }
  }
`;

const YEAR_CONTRIBUTIONS_QUERY = `
  query yearContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            owner { login }
          }
        }
        issueContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            owner { login }
          }
        }
        pullRequestContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            owner { login }
          }
        }
        pullRequestReviewContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            owner { login }
          }
        }
      }
    }
  }
`;

async function graphql(query, variables, token) {
  const { data } = await axios.post(
    CONFIG.GRAPHQL_URL,
    { query, variables },
    {
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  if (data.errors?.length) {
    throw new Error(data.errors.map((e) => e.message).join('; '));
  }

  return data.data;
}

async function fetchContributionYears(username, token) {
  const data = await graphql(CONTRIBUTION_YEARS_QUERY, { login: username }, token);
  return data?.user?.contributionsCollection?.contributionYears ?? [];
}

async function fetchYearRepos(username, year, token) {
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year + 1}-01-01T00:00:00Z`;
  const data = await graphql(
    YEAR_CONTRIBUTIONS_QUERY,
    { login: username, from, to },
    token
  );

  const collection = data?.user?.contributionsCollection;
  if (!collection) {
    return [];
  }

  const repos = new Set();
  const groups = [
    collection.commitContributionsByRepository,
    collection.issueContributionsByRepository,
    collection.pullRequestContributionsByRepository,
    collection.pullRequestReviewContributionsByRepository,
  ];

  for (const group of groups) {
    for (const entry of group ?? []) {
      const repo = entry?.repository;
      if (!repo?.nameWithOwner) continue;
      if (repo.owner?.login === username) continue;
      repos.add(repo.nameWithOwner);
    }
  }

  return [...repos];
}

async function fetchAllTimeContribCount(username, token) {
  const years = await fetchContributionYears(username, token);
  const externalRepos = new Set();

  for (let i = 0; i < years.length; i += CONFIG.CONCURRENCY) {
    const batch = years.slice(i, i + CONFIG.CONCURRENCY);
    const results = await Promise.all(
      batch.map((year) => fetchYearRepos(username, year, token))
    );
    for (const repos of results) {
      for (const repo of repos) {
        externalRepos.add(repo);
      }
    }
  }

  return externalRepos.size;
}

function patchStatsSvg(svg, count) {
  const value = String(count);

  let patched = svg.replace(
    /Contributed to \(last year\):/g,
    'Contributed to:'
  );

  patched = patched.replace(
    /Contributed to \(last year\): \d+/,
    `Contributed to: ${value}`
  );

  patched = patched.replace(
    /(<text[^>]*data-testid="contribs"[^>]*>)[^<]*(<\/text>)/,
    `$1${value}$2`
  );

  if (!patched.includes('data-testid="contribs"')) {
    throw new Error('Could not find contribs value in stats SVG');
  }

  return patched;
}

async function main() {
  const token =
    process.env.STATS_PAT ||
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN;
  if (!token) {
    throw new Error('STATS_PAT, GITHUB_TOKEN, or GH_TOKEN is required');
  }

  const svg = await fs.readFile(CONFIG.STATS_SVG_PATH, 'utf-8');
  const count = await fetchAllTimeContribCount(CONFIG.USERNAME, token);

  console.log(`All-time contributed repos (external): ${count}`);

  const patched = patchStatsSvg(svg, count);
  await fs.writeFile(CONFIG.STATS_SVG_PATH, patched, 'utf-8');

  console.log(`✓ Patched ${CONFIG.STATS_SVG_PATH} with all-time contributed-to count`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Failed to patch all-time contribs:', error.message);
    process.exit(1);
  });
}

module.exports = { fetchAllTimeContribCount, patchStatsSvg, main };
