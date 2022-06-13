---
title: Use Git like a pro!
excerpt: >-
  Git allows so much flexibility, Over the past few months
  I have improved my workflows and documented this here
date: '2021-01-04'
thumb_img: thumb.png
content_img: thumb.png
layout: post
---

Over the past few months I have been using Git & GitHub more frequently, both in my professional and personal work,
with this came many questions about what the "correct" way is to use Git.

There are obviously many ways to create workflows using Git, however below is the way that I have started to manage my workflow,
this is likely to change over time as it is only my first workflow but this is a start!

## What to solve?

There are many things that I didn't like about the way I used Git in the past and so these are some of the issues I am aiming to solve:

- Versioning
- Standardised git commit messages
- How best to utilise Branches
- When should Pull Requests be used
- How can the workflow be Automated

## Why solve them?

Well this is quite straight forward, to improve the readability of my Git Repos especially in open source projects,
but also to keep my mind clear and organised.

## How were these issues solved?

Below I have split each area to solve out, this explains how I solved the issues I was experiencing.

### Versioning

Versioning was something that I never thought about, I increased when I wanted to based on what I thought was right.

Then I started doing code professionally and was introduced to the [Semantic Versioning](https://semver.org/) specification.

This made much more sense by adding a relationship between each different increment.

A version number would be MAJOR.MINOR.PATCH, Increments as below:

- `MAJOR` version when changes are mede that would break previous functionality.
- `MINOR` version when functionality is added in a backwards compatible manner.
- `PATCH` version where you make backwards compatible bug fixes.

by using this method people are now able to easily identify what type of change has been implemented and if it is likely to break their current project.

### Conventional Commits

My commit records were... well... a total mess, Looking at other repos this is quite common and not many projects follow a standard.
I was looking for a better way to provide commit messages that just make sense and are easy to read, in my research I found a standard called
[Conventional Commits](https://www.conventionalcommits.org/).

Conventional Commits is a specification for adding human and machine readable meanings to commit messages, this then allows the creation of
ChangeLogs through Automation and makes life easier for a human to tell what has changed!

The specification is real simple so doesn't take much to get your head around:

```shell
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

The commit contains the following structural elements:

- fix: a commit of the *type* `fix` resolves a bug in the codebase (`PATCH` in SemVer)
- feat: a commit of the *type* `feat` adds a new feature to the codebase (`MINOR` on SemVer)
- Breaking Changes: a commit that appends `!` after the *type/scope*, where a breaking change is introduced (`MAJOR` in SemVer). A breaking change can be part of commits of any type.
- Other *types* are allowed for example: `build:`, `ci:`, `docs:`, `style:`, `test:` and others.
- Body & Footers may be provided to include Breaking Change as well as other information.

Some examples:

```shell
fix(core): error handling of CLI Command
```

This example shows a `fix` for the `core` scope and the fix was for error handling of CLI Command

```shell
feat(core)!: Updated API to add more functionality to xxx
```

This example adds a `feat` to the `core` scope, its a breaking change and shows that more functionality was added to the API.

As you can see this is such a simple and easy to understand convention which is very easy to use in automation if needed.

### Branches

When I first started using Git Branches were something of a mystery to me, I didn't understand why you would want to commit to a branch and then have to push to master.
After using Git for a few years I have realised their huge benefits and how they assist me with automation of tasks.

For every issue that is reported I will create a new branch, the branch will be named as follows:

```shell
<issue number>-<short_description>
```

Example:

```shell
311-softLimit
```

By doing this I am able to quickly link a branch to a specific issue in the project. Branches also enable me to make multiple commits at smaller increments, which I then use Pull Requests to merge with Master

### Pull Requests

I now utilise Pull Requests to move my branch into the master, the pull request has various checks using GitHub Actions depending on the project type
This would be things like:

- **Version check:** confirm that the version in the project files has been incremented since the last release
- **Tests:** Check that the code functions as expected
- **Linting:** Check that the code still adheres to the relevant standards

With all of my Repos I will only enable `Allow squash merging` this allows me to create one good commit message that covers the issues fixed for the specific branch we are merging, rather than all the commits from the development lifecycle (keeping my master commits clean)

### Version Tags

Once I have completed all of the pull requests for a specific release I will then add a version `tag` to the master.

This version tag creates a point in time reference along with triggering my release automation once it is pushed.

### Automated Workflow

In order to streamline my delivery to release I have started to utilise GitHub Actions, This allows me to have endless automation capabilities.

Currently I utilise Actions for the following:

- Linting
- Tests
- Version Checks
- ChangeLog Generation
- Release creation
- Push to external artifactories (e.g. Docker Hub, Ansible Galaxy etc.)

The changelog and release process is something that I have just started doing, I was manually writing out my changelog for
any new releases which was time consuming and required a lot of manual back and forth to confirm what was changed,
not an issue whilst a project is small, but if it grows that would quickly become out of control.

## Final Thoughts

I believe that at this time for the work I am doing this is the best workflow for myself, If you have any thoughts on ways
this could be further improved, please let me know over on my [Discord](https://discord.gg/6fmekudc8Q)
