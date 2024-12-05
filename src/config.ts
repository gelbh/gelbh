interface Config {
  github: {
    username: string;
    repos: string[];
    wakatime_username?: string;
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
  // skills: {
  //   languages: string[];
  //   frameworks: string[];
  //   tools: string[];
  // };
}

export const config: Config = {
  github: {
    username: "gelbh",
    repos: ["gelbh", "hevy-tracker", "gelbhart-dev"],
    wakatime_username: "gelbh",
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
  // skills: {
  //   languages: ["TypeScript", "JavaScript", "Python"],
  //   frameworks: ["React", "Node.js", "Express"],
  //   tools: ["Docker", "Git", "AWS"],
  // },
};
