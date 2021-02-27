---
title: Use GitHub pages with unsupported plugins
excerpt: >-
  Github Pages only support certain Jekyll plugins,
  find out how to mitigate this issue
date: '2020-12-09'
thumb_img: thumb.png
content_img: thumb.png
layout: post
---

I have recently migrated my website over to Github Pages, however in doing so I have found that there are some limitations, the main one being that not all Jekyll plugins are supported.

Due to this I needed to find a workaround, which I wanted to share with you all

## Advantages of this method

### Control over gemset

- Jekyll Version - Instead of using the version forced upon you by GitHub, you can use any version you want
- Plugins - You can use any Jekyll plugins irrespective of them being supported by GitHub

### Workflow Management

- Customization - By using GitHub Actions, you are able to customize the build steps however you need them
- Logging - The build log is visible and can be adjusted, so it is much easier to debug errors

## Setting up the GitHub Action

GitHub actions are created by adding a YAML file in the directory `.github/workflows`. Here we will create our action using the Jekyll Action from the Marketplace.

Create a workflow file `github-pages.yml`, then add the below information:

```
name: Build and deploy Jekyll site to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

jobs:
  github-pages:
    runs-on: ubuntu-16.04
    steps:
      - uses: actions/checkout@v2
      - uses: helaili/jekyll-action@2.0.1
        env:
          JEKYLL_PAT: ${{ secrets.JEKYLL_PAT }}
```

This workflow is doing the following:

- We trigger `on.push` to `master`, or by a manual dispatch `workflow_dispatch`
- The `checkout` action clones your repository.
- Our action is specified along with the required version `helaili/jekyll-action@2.0.1`
- We set an environment variable for the action to use `JEKYLL_PAT` a Personal Access Token

## Providing permissions

The action needs permissions to push the Jekyll data to your `gh-pages` branch (this will be created if it doesn't exist)

In order to do this, you must create a GitHub Personal Access Token on your GitHub profile, then set this as an environment variable using Secrets.

1. On your GitHub profile, under Developer Settings, go to the Personal Access Tokens section.
2. Create a token. Give it a name like “GitHub Actions” and ensure it has permissions to public_repos (or the entire repo scope for private repository) — necessary for the action to commit to the gh-pages branch.
3. Copy the token value.
4. Go to your repository’s Settings and then the Secrets tab.
5. Create a token named `JEKYLL_PAT` (important) and paste your token into the value

## Deployment

On pushing changes onto `master` the action will be triggered and the build will start.

You can watch the progress by looking at the actions that are currently running via your repository

If all goes well you should see a green build status on the `gh-pages` branch.

If this is a new repository you will also need to setup the pages to use the new `gh-pages` branch instead of master. this can be found in the repository settings.
