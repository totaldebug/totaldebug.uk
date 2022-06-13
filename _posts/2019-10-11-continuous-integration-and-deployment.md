---
title: Continuous Integration and Deployment
date: 2019-10-11 00:00:00 +0100
image:
  name: thumb.png
categories: [Development, Continuous Integration]
tags: [CI, CD, continuous, integration, deployment]
---

I have recently been looking into CI and CD, mainly for use at home with my various projects etc. but also to further my knowledge.

Over the years I have built up quite an estate of servers that over time become more difficult to manage and maintain, mostly I will spend a long time researching and deploying a solution, but when it breaks weeks / months later i struggle to remember how it was all built.

## There must be a better way!

So now im looking for the best way to deploy / re-deploy and test all of my servers and services with minimum effort and without breaking them if I do something wrong.

I started by building out Ansible playbooks, one for each of my servers, this works great for deploying my servers with all the apps that I require, However this doesn't help with things like home assistant configuration changes, if I change my config I have to do it via atom with a remote plugin that allows FTP on changes. This works&#8230; but if i make a mistake i take home assistant offline which doesn't go down well with the family!

After this I thought how can I update my configuration, keep it backed up, have the ability to roll it back and also test it before I put it on my server?

So I have now started using [GitHub](https://github.com/marksie1988/home-assistant-config) to store my configuration, this gives me a backup in case my server dies and also helps the HA Community see examples of the configuration for their own deployments.

I also want to check the new configuration when it gets committed to GIT but before I download it to home assistant, for this I use [gitlab](https://gitlab.com/marksie1988/home-assistant-config/pipelines). Whenever gitlab detects a commit on the GIT repository it will begin a pipeline on gitlab that checks my latest configuration for various things:

- MarkdownLint - Checks any files with markdown in to make sure it is valid
- YAMLlint - Checks YAML files for formatting and validation
- JSONlint - Checks any JSON files for formatting and validation
- HA Stable / Dev / Beta - My Home Assistant configuration is then checked against the different builds

By doing all of the above checks I will know that the code works as expected and I can also tell that it will work with all the current releases of HomeAssistant.

Once the configuration has been checked the pipeline will trigger a webhook back to my Home Assistant server which then pulls the latest commit from GitHub and restarts HomeAssistant.

Now I have gone from roughly 15 / 30 minutes for testing and troubleshooting, along with potential outages down to around 2 minutes and no long outage for my Home Assistant.

## Conclusion

By doing this I have saved myself 13 / 28 minutes per configuration change, when you add that up over weeks / months of changes I have very quickly saved a days worth of configuration change! If you then add the time saved by using Ansible, I can deploy a brand new Home Assistant server in around 10 minutes which is fully configured and functional.
