---
id: 6208
title: Install, Configure and add a repository with Git on CentOS 7
date: 2018-04-07T07:36:46+00:00
author: marksie1988
layout: post
guid: http://spottedhyena.co.uk/?p=6208
permalink: /install-configure-and-add-repository-with-git-on-centos-7/
slide_template:
  - default
audio_mp3:
  - ""
audio_ogg:
  - ""
audio_embed:
  - ""
video_mp4:
  - ""
video_ogv:
  - ""
video_webm:
  - ""
video_embed:
  - ""
video_poster:
  - ""
link_url:
  - ""
status_author:
  - ""
quote_author:
  - ""
featured_media:
  - 'true'
image: https://spottedhyena.co.uk/wp-content/uploads/2018/04/git-fork.jpg
categories:
  - CentOS
  - Linux
tags:
  - centos
  - code
  - commit
  - git
  - git hub
  - github
  - init
  - repo
  - repository
---
Git is an open source, version control system (VCS). It’s commonly used for source code management by developers to allow them to track changes to code bases throughout the product lifecycle, with sites like GitHub offering a social coding experience, and multiple popular projects utilising it great functionality and availability for Open Source sharing.

First off lets make sure that CentOS is up to date:

<pre class="lang:default decode:true ">yum update -y</pre>

Then we can install Git, it couldn&#8217;t be simpler, just run the below command:

<pre class="lang:default decode:true ">yum install -y git</pre>

If you want to see which version of Git has been installed then you can issue the below command:

<pre class="lang:default decode:true ">git --version</pre>

When you commit code Git will show errors if you don&#8217;t configure global user details, to do this you should run the following commands, change the user and email to your details:

<pre class="lang:default decode:true ">git config --global user.name "MyUsername"
git config --global user.email "MyEmail@example.com"</pre>

To confirm that the configuration has set as expected we can run the following, this will take us to our root directory and then show the contents of the file:

<pre class="lang:default decode:true ">cd
cat .gitconfig</pre>

or you can use the command:

<pre class="lang:default decode:true ">git config --list</pre>

Now that we have Git installed and configured we need to create our first repository, a repository is where you place all of your code ready for committing to github. It is also possible to clone repositories from [github](http://github.com/) and provide contributions to other peoples projects.

## Creating a Repository

First we need to create a new folder where we will be storing our new project. Once this is done head into your directory:

<pre class="lang:default decode:true ">mkdir MyProject
cd MyProject</pre>

Once we are inside our folder we need to initialise the repository, this will add all the files required for git to track the project:

<pre class="lang:default decode:true">git init</pre>

Now we have our repository! its that simple&#8230;

To add files to our repository ready for the commit we would simply type:

<pre class="lang:default decode:true">git add</pre>

If we want to commit this code up into github then we would need a couple of extra commands, these will add the remote origin where our code will be committed, then it will push our code up to the remote origin.

<pre class="lang:default decode:true">git remote add origin https://github.com/username/new_repo
git push -u origin master</pre>

&nbsp;

## Cloning a Repository

In some cases you may already have a repository that you would like to clone and then change the existing code, well that is simple to do too. Get the URL for the clone from GitHub or any other Git SVN and type the following:

<pre class="lang:default decode:true">git clone &lt;URL TO REPOSITORY&gt;</pre>

This will then download the contents from the repository and onto your CentOS Server

&nbsp;

Hopefully this tutorial has been useful for you, please feel free to ask me any questions that you may have, or if you would like a more in depth article for further functions of Git.

&nbsp;