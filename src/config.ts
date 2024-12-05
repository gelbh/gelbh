interface Config {
  github: {
    username: string;
    repos: string[];
  };
  social: {
    website: string;
    linkedin: string;
  };
  badges: {
    colors: {
      primary: string;
      textLight: string;
      textDark: string;
    };
  };
}

export const config: Config = {
  github: {
    username: "gelbh",
    repos: ["gelbh", "hevy-tracker", "gelbhart-dev", "gelbhart-innovations"],
  },
  social: {
    website: "https://gelbhart.dev",
    linkedin: "https://linkedin.com/in/tomer-gelbhart",
  },
  badges: {
    colors: {
      primary: "3B7EBF",
      textLight: "474A4E",
      textDark: "FFF",
    },
  },
};
