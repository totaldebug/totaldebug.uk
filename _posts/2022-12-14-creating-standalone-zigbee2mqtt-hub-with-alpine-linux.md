---
title: "Creating a standalone zigbee2mqtt hub with alpine linux"
date: 2022-12-15 15:13:00 +0100
categories: [Home Automation]
tags: [zigbee2mqtt, zigbee, alpine, raspberry, pi, mqtt, stateless]
---

I have began sorting out my smart home again, I let it run to ruin a year or so ago and now I'm getting solar installed I wanted to increase my automation to make life easier and utilise my solar more efficiently once it's installed.

As part of my automation I used to run deconz with some zigbee IKEA Tradfri lights around the house, I found deconz limiting at the time and it doesn't seem to have progressed much, whereas zigbee2mqtt seems to have moved a long way and has a lot of support.

I also had the issue that Home Assistant now runs on a virtual machine in my loft, where the conbee II signal didn't reach my devices, so to combat this I wanted to utilise an old raspberry pi and create a zigbee hub that is easy to maintain in a set and forget fashion, if it stops working, reboot and it works again.

This is when I came up with ZigQt, an Alpine overlay that will fully configure a Zigbee2mqtt controller on a Raspberry Pi in a stateless manner. Through this article I will show you how to setup this great little ZigQt hub

# Hardware

For this I have used the following hardware:

* Raspberry Pi 3b plus
* POE+ Hat (Optional)
* Micro SD Card
* Conbee II (can use other zigbee dongles)

# OS Installation

For the OS I have used Alpine Linux, by default Alpine is a diskless OS, meaning it loads the whole OS into memory and this makes it lightning fast.

## Create a bootable MicroSD card with two partitions

The goal is to have a MicroSD card containing two partitions:

* **The system partition:** A `fat32` partition, with `boot` and `lba` flags, on a small part of the MicroSD card, enough to store the system and the applications (suggested 512MB to 2GB).
* **The storage partition:** A `ext4` partition occupying the rest of the MicroSD card capacity, to use as persistent storage for any configuration data that may be needed.

### Creating the partitions (assuming you re using Linux)

Mount the SD card (this should be automated, if not, you probably know how to do that and you probably don’t need that tutorial)

List your disks:

```shell
sudo fdisk -l
Disk /dev/sda: 7624 MB, 7994343424 bytes, 15613952 sectors
```

The disk you just inserted should be available in the list. It most likely should be called /dev/sda.

Create 2 partitions:

* 512MiB partition for Alpine itself (have to be of type 0x0c - W95 FAT32 (LBA))
* All other available space on a partition for your var folder

```shell
sudo fdisk /dev/sda
n - p - 1 - +512M - t - 1 - c - a - w
n - p - 3 - - - w
```

Format you first partition to fat and the second to ext4

```shell
sudo mkfs.vfat -F 32 /dev/sda1
sudo mkfs.ext4 /dev/sda2
sudo mkfs.ext4 /dev/sda3
```

## Mount the system partition

Type the command `fdisk -l` to list the disks that are accessible to the computer. Make note of the device name for the SD card.

Type the command `mkdir /mnt/SD` to create a mount point for the SD card. You can replace `/mnt/SD` in any directory that you prefer.

Type the command `mount -t vfat /dev/sdc1 /mnt/SD` to mount the SD card.

 - `-t vfat` tells the operating system that it is a Windows file system.
 - `/dev/sdc1` Replace with the device name from the `fdisk` output.
 - `/mnt/SD` Replace with the name of the directory you created for where the disk will be accessed.

Type the command `cd /mnt/SD` to access the files on the SD card.

## Copy Alpine Linux onto the MicroSD Card

Download the Alpine Linux Raspberry Pi version from [Alpine Linux](https://alpinelinux.org/downloads/)

Extract the tarball into to system (bootable fat32 2GB) partition.

```shell
tar -zxvf ~/Downloads/alpine-rpi-3.14.0-aarch64.tar.gz
```

Since it will be a headless install (without an external monitor plugged in) you can setup minimum memory usage for the GPU, maximizing available memory, via a user custom configuration file:

(Make sure you’re still on the same working directory as the previous command. Check with pwd.)

```shell
echo "gpu_mem=32" > usercfg.txt
```

## Add ZigQt Overlay

I have created an overlay that adds everything needed to get this zigbee hub up and running. Doing this manually takes some time and would be another blog post to explain it all.

Download the latest `zigqt.apkovl.tar.gz` from [ZigQt Releases](https://github.com/totaldebug/zigqt/releases).

Now you can copy this to the root of the SD Card where you placed the Alpine Linux files.

At this point you could boot up the device and everything should work, however there are some additional steps you can undertake to add further customisation to the ZigQt hub.

### Additional Configuration

Add-on files can be copied to the root of the OS partition and will be copied to the correct location on ZigQt, these allow further customisations.

#### Interfaces

If you would like to set a static IP Address for the hub, create an `interfaces` file in the root of the OS partition with the IP details:


```shell
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet static
  address 10.42.0.10
  netmask 255.255.255.0
  gateway 10.42.0.1
```
{: title="eth0 example"}


```shell
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet dhcp

auto wlan0
iface wlan0 inet static
  address 10.42.0.10
  netmask 255.255.255.0
  gateway 10.42.0.1
```
{: title="wlan0 example"}

> The `lo` interface is recommended, but you only need add the specific interface you plan on using after this e.g. `eth0` or `wlan0` or `usb0`
{: .prompt-note}

[interfaces sample](https://github.com/totaldebug/zigqt/blob/main/samples/interfaces)

#### Wireless Network Configuration

If using wireless, you will need to create a [wpa_supplicant.conf](https://github.com/totaldebug/zigqt/blob/main/samples/wpa_supplicant.conf) file.

#### Zigbee2MQTT Configuration

A default zigbee2mqtt configuration is created during install, however this may not suite your needs in this case you can create a custom [configuration.yaml](https://github.com/totaldebug/zigqt/blob/main/samples/configuration.yaml) file. Further configuration options can be found [here](https://www.zigbee2mqtt.io/)

### Further customisation

[This repository](https://github.com/totaldebug/zigqt) may be forked/cloned/downloaded. The main script file is `headless.sh`. Execute `./make.sh` to rebuild `zigqt.apkovl.tar.gz` with any of the changes made.

# On your Pi
## Initial Boot
Each time the hub reboots, the initial boot sequence will be run, this ensures that the OS is the same on every boot greatly reducing the risk of changes to the OS causing issues with the hub.

The following directories are mapped to persistent storage:

* `/var`
* `/etc/zigbee2mqtt`

This ensures certain configuration is not lost on reboot.

## User/Password management
The `root` user will have no password by default. It isn't currently possible to update the password without breaking the way the overlay works, however in theory you could launch a copy of Alpine Linux without the zigqt overlay, setup a password and alternative used, run `lbu commit` to save the changes and then merge the required files with those in `zigqt.apkovl.tar.gz`

If I manage to figure out an easier way to do this I will be sure to update this article.

## Zigbee2mqtt

If everything has worked, zigbee2mqtt should be accessible at the following address: `http://zigqt.local:8080`.

Any configuration changes made in the web interface will be saved to the persistent storage, so will still be in effect after a reboot.


## Updates
To update to newer versions, simply reboot, the latest available zigbee2mqtt will be installed.

# Final thoughts

At the moment this is the best solution I could think of to provide a fully functioning and maintenance free version of Zigbee2mqtt on a standalone Raspberry Pi.

I hope to have a solution for the user and password management someday, but if you know a way to get around this please do let me know.
