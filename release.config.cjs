module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/tropical-algae/TABlog",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          { type: "update", release: "major" },
          { type: "refactor", release: "patch" },
          { type: "docs", release: "patch" },
          { type: "chore", release: "patch" },
          { type: "style", release: "patch" }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "refactor", section: "Code Refactoring", hidden: false },
            { type: "docs", section: "Documentation", hidden: false },
            { type: "chore", section: "Chores", hidden: false },
            { type: "style", section: "Style", hidden: false },
            { type: "update", section: "Major Updates", hidden: false }
          ]
        }
      }
    ],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/npm", { npmPublish: false }],
    ["@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message: "${nextRelease.version} Release!\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
};