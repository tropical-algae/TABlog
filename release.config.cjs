module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/tropical-algae/release_test_vue",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/npm", { npmPublish: false }],
    ["@semantic-release/git", { 
    assets: ["package.json", "CHANGELOG.md"], 
    message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}" 
    }],
    "@semantic-release/github"
  ]
};