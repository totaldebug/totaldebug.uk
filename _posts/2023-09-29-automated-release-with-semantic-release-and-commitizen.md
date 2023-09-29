---
title: Automated release with Semantic Release and commitizen
date: 2023-09-29 10:14:35 +0100
image:
  name: thumb.png
categories: [Automation]
tags: [typescript, release]
pin: false
toc: true
comments: true
---

When working with JavaScript projects, managing version numbers and commit messages is important for the maintainability of the project. Since 2020 I have been the main developer of [Atomic Calendar Revive](https://github.com/totaldebug/atomic-calendar-revive) a highly customisable Home Assistant calendar card, I found maintaining versions and releases to be cumbersome until recently. In this article, I will introduce the [commitizen](https://github.com/commitizen/cz-cli) and [semantic-release](https://github.com/semantic-release/semantic-release) packages for creation or appropriate commit messages and semantic versioning. I will also provide examples of how I am currently using these packages to streamline my release workflow and project maintenance.

## The old days

Starting out I had never developed a project like this in TypeScript, I had only ever worked on Python projects, So I was running `yarn run build` which would run rollup, build my js files into a dist folder, I would then commit the changes to a branch, create a PR, merge the PR then manually tag the new version and create the release on GitHub.

As you can see there are quite a few manual steps to achieve this which took too much time, time I could be spending on new features or bug fixes.

I knew there had to be a better way to do this, there was no way large teams were wasting this much time on releases and as a small one person dev, its even more important to save as much time as possible.

## What is Semantic-release and how does it work?

**semantic-release** uses the commit message to determine the impact of changes in the codebase, with this it is able to automate updating the version number correctly and managing the release process for the project.

Semantic-release performs the following basic operations:

1. Analyses commit messages to determine whether a new version is required.
1. If a new version is required, automatically determines the appropriate version number.
1. Updates the CHANGELOG file and creates the relevant Git tag.
1. Publishes a github release if required
1. Publishes the new version to the package manager if required.

There are many other actions that it can perform via a great plugin architecture, so these are not limited to github / npm.

## What is Commitizen and how does it work?

**commitizen** helps developers write commit messages in the same format, this also ensures that all commit messages follow the semantic versioning requirements.

Commitizen provides an interactive interface that prompts developers for specific information relating to that change, it then generates the commit message in the correct format, ensuring compatibility with semantic versions which ensures semantic-release can read the commit messages as expected.

{% include post-picture.html img="commitizen_tui.png" alt="Commitizen TUI" h="200" w="400" shadow="true" align="true" %}

## How to setup Semantic-release and Commitizen

Below is a guide on how to use Semantic-release and Commitizen packages in your project, these are settings that I currently use but you can amend them to better suit your project.

1. Install Semantic-release and Commitizen packages

```bash
npm install --save-dev semantic-release commitizen cz-conventional-changelog
```
{: title='Install components'}

If you find you are unable to use the `git cz` command after using the above install try this:

```bash
npm install -g commitizen
```
{: title='Install commitizen globally'}

This will install commitizen globally which seems to resolve the issue.

2. Create a configuration file for `semantic-release` (`.release.rc`, `release.config.js` or `package.json`) an example of how I use `package.json`:

```json
"release": {
 "plugins": [
  [
   "@semantic-release/commit-analyzer",
   {
    "preset": "conventionalcommits"
   }
  ],
  [
   "@semantic-release/release-notes-generator",
   {
    "preset": "conventionalcommits"
   }
  ],
  [
   "@semantic-release/npm",
   {
    "npmPublish": false
   }
  ],
  [
   "@semantic-release/exec",
   {
    "prepareCmd": "yarn run build"
   }
  ],
  "@semantic-release/changelog",
  [
   "@semantic-release/git",
   {
    "assets": [
     "package.json",
     "changelog"
    ],
    "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
   }
  ],
  [
   "@semantic-release/github",
   {
    "assets": [
     {
      "path": "dist/atomic-calendar-revive.js"
     }
    ]
   }
  ]
 ]
}
```
{: file='package.json'}

This configuration file contains settings used for semantic-release. Lets break this down:

- `@semantic-release/commit-analyzer`: Analyses commit messages and determines how the version number should be incremented (major, minor, patch). I use the conventional commits format so set the preset to inform commit-analyzer, this will look out for the `!` to signify breaking changes etc.
- `@semantic-release/release-notes-generator`: Generates the release notes based on commit messages related to the new version.
- `@semantic-release/npm`: Updates the package.json file and publishes to the NPM package manager, I don't publish to NPM manager so disabled this but i do need package.json updating with the latest version.
- `@semantic-release/exec`: This executes a command, in this case it will build my project ready for uploading to GitHub.
- `@semantic-release/changelog`: Creates or updates a CHANGELOG file based on the generated release notes.
- `@semantic-release/git`: Commits changes related to the new version to the git repository and creates the relevant git tag. I use this to commit the updated package.json into git and it also adds a commit message.
- `@semantic-release/github`: Publishes the new version to GitHub and creates the related GitHub release. I also upload the file generated by `@semantic-release/exec`

3. Configure the `cz-conventional-changelog` adapter in `package.json`

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```
{: file='package.json'}

4. Configure CI / CD, I use Github Actions in the below example:

```yaml
name: Release

on:
  push:
    branches:
      - master
      - beta
  workflow_dispatch:
jobs:
  release:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2

    - name: Install dependencies
      run: yarn install

    - name: Run Semantic Release
      run: npx semantic-release
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
{: file='.github/workflows/release.yml'}

## How to use semantic-release and commitizen

### Commitizen

Simply run `git add .` then `git cz`, this command will run the interactive interface of Commitizen and ask you to write a properly formatted commit message.

### Semantic Release

Semantic release by default uses the following branches:

- **master** Regular releases to the default distribution channel
- **N.N.x or N.x.x or N.x with N being a number** Regular releases to a distribution channel matching the branch name from any existing branch with a name matching a maintenance release range
- **next** Regular releases to the next distribution channel
- **next-major** Regular releases to the next-major distribution channel
- **beta (pre-release)** pre-releases to the beta distribution channel
- **alpha (pre-release)** pre-releases to the alpha distribution channel from the branch

You don't need to use all of these branches, for example I currently only use the  `beta` and `master` branches, All my development happens in beta, on commit it releases a pre-release version then once i'm happy its working I merge `beta` into `master` which will create the latest production release.

## How are version numbers determined from commit messages

Semantic release wil analyze the commit message to determine what the new version number should be. This process works by analysing the words and prefixes in the commit message. Commitizen facilitates this by ensuring the conventional commits format is followed.

The conventional commit format states that commit messages should be formatted as follows:

```
<type>([optional scope]): <summary>

[optional body]

[optional footer(s)]
```

- **type**: Indicates the type of change (e.g., fix, feat, chore, docs, refactor, test, etc.).
- **[optional scope]** (optional): Describes the part of the project that the change is applied to.
- **summary**: A concise description of the change.
- **[optional body]** (optional): A more detailed description of the change if required.
- **[optional footer(s)]** (optional): Add tags to issues / reviewers etc.

Semantic-release uses this information to determine how to update the version number:

- If at least one of the commit messages is `feat` type, the new version number will be subject to a “minor” increase (`0.1.0`).
- If at least one of the commit messages contains `BREAKING CHANGE` in the body or `!` after the type, the new version number will be subject to a **major** increase (`1.0.0`).
- In other cases, especially if at least one of the commit messages is `fix` type, the new version number will be subject to a **patch** increase (`0.0.1`).

## Final Thoughts

With the help of semantic-release and commitizen packages, you can increase the quality and maintainability of your project by using automated versioning and creating appropriate, easy to understand commit messages. Due to this being compatible with CI/CD it also makes the development process more efficient saving precious time to be spent on improving the project or drinking coffee.
