module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/tropical-algae/TABlog",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          { type: "refactor", release: "patch" },
          { type: "docs", release: "patch" },
          { type: "chore", release: "patch" }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "refactor", section: "Code Refactoring", hidden: false },
            { type: "docs", release: "Update Docs", hidden: false },
            { type: "chore", section: "Performance Improvements", hidden: false }
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