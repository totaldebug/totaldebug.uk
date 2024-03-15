---
title: "Homer dashboard with Docker"
date: 2022-10-15 22:57:00 +0100
image:
  path: assets/img/posts/homer-dashboard-with-docker/demo_dash.png
categories: [Containers]
tags: [homer, docker, container, dashboard]
series: Homer
---

Recently I have decided to get my home network in order, One of the things I realised was that I spend a lot of time trying to remember the IP addresses or URLs for services within my home, especially ones that I access infrequently.

At one point I did have a dashboard that was HTML but I never updated it and I decided to remove it a year or so ago.

After sitting on YouTube for a few hours watching rubbish I came across [Homer](https://github.com/bastienwirtz/homer), A simple to use Docker container that hosts am easily configurable dashboard with customisable designs.

Homer is configured using YAML making it very familiar to myself having used Docker for a number of years now.

# Directory setup

In order to use Homer with Docker first I created a directory to store the configuration file and any other assets such as images. Mine are on an NFS share but this would also be the same for local files. My file structure is as follows:

```
📦dockerfiles
 ┣ 📂homer
 ┃ ┗ 📂data
 ┗ 📂portainer
   ┗ 📂data
```

As you can see, I create a directory for each container, then within that a subdirectory for each volume mapped to a container folder, usually this is just `data`, but some containers require more.

# Docker

The container can then be launched one of two ways, via command, or via docker-compose.

I use portainer, linked to a GitHub repository that will re-deploy any time that I update the `docker-compose.yml` file on GitHub (more on that in another article!)

## CMD

```shell
docker run -d \
  -p 8080:8080 \
  -v /dockerfiles/homer/data:/www/assets \
  --restart=always \
  b4bz/homer:latest
```

Here we are creating a container without loading it to shell with `-d`, then we link the docker host port with the docker container port `-p 8080:8080`, next, map the data folder on our docker host to the assets on the container `-v /dovkerfiles/homer/data:/www/assets` the assets folder contains the config file as well as images. We always want the container to restart if the host reboots `--restart=always` and lastly we specify the image and what version we would like to use `b4bz/homer:latest`

## Compose

Here we essentially have the same configuration as the docker command, the one small change I have made though is to use a Docker Volume to map the volumes from OS to Container, this is the preferred method.

```yaml
version: "3.6"

services:
  homer:
    image: b4bz/homer
    container_name: homer
    hostname: homer
    volumes:
      - homer_data:/www/assets
    ports:
      - 8080:8080
volumes:
  homer_data:
    driver_opts:
      type: none
      device: /mnt/nfs/dockerfiles/homer/data
      o: bind
```

Once you have the `docker-compose.yml` file you can run `docker-compose up -d` which will create the volume, download the image and start the container.

# Accessing the Homer dashboard

Now that the container is up and running you can access it via:

```shell
http://<docker-host-ip-address>:<port>
```

So in my case this would be:

```shell
http://172.16.20.4:8080
```

If everything has worked as expected you should see the following demo dashboard:

{% include post-picture.html img="demo_dash.png" alt="Homer default demo dashboard" %}

For more information on how to configure this dashboard check out [this article](https://totaldebug.uk/posts/configuring-homer-dashboard) where I cover the configuration of the dashboards in more detail.

Hopefully this information was useful for you, If you have any questions about this article, share your thoughts and comment in the discussion below or head over to my [Discord](https://discord.gg/6fmekudc8Q).
