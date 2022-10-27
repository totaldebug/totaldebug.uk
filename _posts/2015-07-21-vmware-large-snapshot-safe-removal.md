---
title: VMware Large Snapshot Safe Removal
date: 2015-07-21
categories: [Virtualisation, VMware]
tags: [snapshot, removal, safe, large]
---
One of the great virtualization and VMware features is the ability to take snapshots of a virtual machine. The snapshot feature allows an IT administrator to make a restore point of a virtual machine, with the option to make it crash consistent. This feature is particularly useful when performing upgrades or testing, as if anything goes wrong during the process, you can quickly go back to a stable point in time (when the snapshot was taken).
<!--more-->

Snapshots are great for quick, short term restores, but can have devastating effects to an environment if kept long term. There are a number of reasons why snapshots should not be kept for long term or used as backups, one of the main issues is I/O performance [1008885](http://kb.vmware.com/kb/1008885). A list of best practices for snapshots can be found here: [1025279](http://kb.vmware.com/kb/1025279). This article shows 1 method to remove snapshots in a way that minimizes impact.

## Noticing High I/O

As mentioned earlier, one of the disasters that can occur when leaving a snapshot active for too long is that it very heavy I/O. After taking a look at the virtual machine, the “Revert to Current Snapshot” is available, so a snapshot exists.

Before deleting the snapshot, check the size of the deltas to get an idea of how long the removal process will take. To do this select your virtual machine, right click the datastore and click browse.

From the datastore select the folder matching your virtual machine name.

As you can see from the delta (000001.vmdk) the snapshots are large. If this were a non-critical server or a small snapshot, I would just delete it, in this example the snapshot exists on a business critical server so I will take the below precautions.

## Why Take Precautions

Although snapshot removal has been substantially improved in newer versions, it is still possible in 5.1 to stun the VM and in 5.5 to fail the removal and require consolidation. For a business critical application such as Microsoft SQL / Exchange that must remain active, the snapshot removal process cannot be cancelled once it has been initiated.

One example that I experienced when I had first started working with VMware, I noticed one of our IT Staff had taken a snapshot on our Exchange server and had left it there for around 2 weeks. It was then decided we would remove the snapshot&#8230; Big Mistake! About 3 hours into the snapshot removal, Our phones were ringing off the hook, our Exchange server had became unresponsive and users could no longer access their mail. For the next 3 hours VMware was removing the snapshot and no one was able to use email.

## Removing a Large Snapshot

As crazy as this will seem, to remove the large snapshot we must first create a new snapshot&#8230; yes you did read that correctly. The reason for this is that it stops VMware writing to the old snapshot delta thus allowing VMware to write it back to the main VMDK without interruption. We then have a much smaller new snapshot that can be easily removed.

Uncheck the &#8220;Snapshot the Virtual machine’s memory&#8221; option and name this: Safe Snapshot Removal. By unchecking the box shown below, this will assist in removing the “Safe Snapshot” once the other snapshot is removed, as we are not expecting to restore to this snapshot it is not required.

We now have 2 snapshots, one from the upgrade (the old large snapshot) and our new Safe Removal Snapshot.

Next, remove the large &#8220;Upgrade&#8221; snapshot. This will roll the snapshot back into the parent and will no longer cause any downtime. Note that this can potentially cause greater I/O penalties, so calculate the risks before proceeding with this method.

Once the Upgrade snapshot has been deleted, I verify that the Safe Removal Snapshot is fairly small. If not, repeat the process. If it is, the Safe Removal Snapshot can be deleted.
