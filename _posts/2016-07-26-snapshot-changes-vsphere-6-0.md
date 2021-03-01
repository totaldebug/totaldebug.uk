---
title: Snapshot changes in vSphere 6.0
date: 2016-07-26
layout: post
---
This is something that I was unaware of until recently when I was looking into the usage of V-Vols. It appears that VMware have made some major improvements to the ways we handle snapshots and consolidate them in vSphere 6.0 with VVols. Most people who use VMware are aware of limitations with snapshots on VMs that have heavy IO or large snapshots attached to them. In a large number of cases we see snapshots fail to remove and then require hours of downtime to actually consolidate.

<!--more-->

Previously we would take a snapshot, this would make the VMDK Read-Only and create a new Delta file that all the new changes would be written to. this file would continue to grow and potentially would end up as big as the VM&#8217;s allocated space. Depending on the size of the snapshot we would also take helper snapshots or &#8220;Safe Removal Snapshots&#8221;, these would allow us to lower the IO on the large snapshot so that the VM didnt see as big an impact when consolidating the first larger snapshot. This would then mean we could remove the helper snapshot, in some cases though the IO was too high for this to work. This could cause VMware to &#8220;Stun&#8221; the server effectively freezing IO and allowing the snapshot removal to take over causing downtime to our end users.

Eventually if you were unable to merge the snapshots to the base disk the server would need to be powered down and the snapshot removed, this could take hours&#8230;

In vSphere 6.0 with VVols this has totally changed!

{% include picture.html img="newsnapshots.png" alt="newsnapshots" %}

As you can see we now take a snapshot, but the base disk is still Read/Write, multiple delta files are created with the changed original data. This means that when we remove the snapshot all we need to do is tell VMware to delete the deltas, no need to write it all to the base VMDK as its already there. This technique was first implemented for the VMware Mirror Driver in vMotion, VMware have now utilised this to provide a near seamless snapshot capability in v6.0 stopping large amounts of downtime all together. There should no longer be any noticeable stun time as we are only removing the references to the snapshot.

Interesting piece of information that I thought some of you might find useful.

UPDATE:

I decided to do a test of snapshot removal times, Using the same VM on both VVol and a normal Datastore by writing a 10gb file to them in the same manner. The VM on VVol took 3 seconds to remove, the VM on the normal Datastore took just over 3 minutes. This doesn&#8217;t sound like a lot but this is a lab on a VM with no load, imagine a 100GB snapshot with heavy load!

So it looks like there are huge benefits to be had with VVol moving forwards.
